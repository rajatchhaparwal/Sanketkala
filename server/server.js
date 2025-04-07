import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const server = http.createServer(app);

// Enable CORS for all routes
app.use(cors({
  origin: ['http://localhost:5173', 'https://sanketkala.vercel.app'],
  methods: ['GET', 'POST'],
  credentials: true
}));

app.use(express.json());

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({ status: 'ok' });
});

// Proxy endpoint for resume maker
app.post('/api/resume', async (req, res) => {
  try {
    const { linkedin, jobUrl, applicantDetails } = req.body;
    
    // Forward the request to Flask app
    const response = await axios.post('http://localhost:5000/generate_resume', {
      job_url: jobUrl,
      applicant_details: applicantDetails || linkedin
    });
    
    return res.json(response.data);
  } catch (error) {
    console.error('Error proxying to resume service:', error);
    return res.status(500).json({ 
      success: false, 
      error: "Failed to generate resume. Please try again." 
    });
  }
});

const wss = new WebSocketServer({ 
  server,
  path: "/ws",
  clientTracking: true,
  perMessageDeflate: false
});

const GEMINI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const MAX_CONNECTIONS = 10;
let activeConnections = 0;

// Store interview context for each connection
const interviewContexts = new Map();

// Ping all clients every 30 seconds to keep connections alive
setInterval(() => {
  wss.clients.forEach((client) => {
    try {
      client.ping();
    } catch (e) {
      console.error('Error pinging client:', e);
    }
  });
}, 30000);

wss.on("connection", (ws, req) => {
    console.log('Client connecting from:', req.headers.origin);
    
    if (activeConnections >= MAX_CONNECTIONS) {
        ws.close(1008, "Server is at maximum capacity");
        return;
    }

    activeConnections++;
    console.log(`New client connected. Total connections: ${activeConnections}`);
    
    // Initialize interview context for this connection
    const context = {
        messages: [],
        isInterviewActive: false,
        lastPing: Date.now()
    };
    interviewContexts.set(ws, context);

    // Send immediate welcome message
    ws.send(JSON.stringify({
        type: "status",
        content: "Connected to interview server"
    }));

    ws.on("pong", () => {
        const ctx = interviewContexts.get(ws);
        if (ctx) {
            ctx.lastPing = Date.now();
        }
    });

    ws.on("message", async (message) => {
        try {
            const data = JSON.parse(message);
            const { type, content } = data;

            switch (type) {
                case "start_interview":
                    context.isInterviewActive = true;
                    context.messages = [];
                    ws.send(JSON.stringify({
                        type: "ai_response",
                        content: "Hello! I'm your AI interviewer. Let's begin. Could you please introduce yourself and tell me what position you're interviewing for?"
                    }));
                    break;

                case "user_speech":
                    if (!context.isInterviewActive) {
                        ws.send(JSON.stringify({
                            type: "error",
                            content: "Interview not started. Please start the interview first."
                        }));
                        return;
                    }

                    console.log("User said:", content);
                    context.messages.push({ role: "user", content });

                    const analysisPrompt = `You are an AI interviewer. The candidate said: "${content}". 
                    Provide constructive feedback and ask a relevant follow-up question. Keep your response concise and natural.
                    Previous context: ${JSON.stringify(context.messages.slice(-3))}`;

                    try {
                        const geminiResponse = await axios.post(
                            `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
                            { contents: [{ parts: [{ text: analysisPrompt }] }] },
                            { headers: { "Content-Type": "application/json" } }
                        );

                        const aiFeedback = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "Could you please repeat that?";
                        context.messages.push({ role: "assistant", content: aiFeedback });
                        
                        ws.send(JSON.stringify({
                            type: "ai_response",
                            content: aiFeedback
                        }));
                    } catch (error) {
                        console.error("Error fetching AI response:", error);
                        ws.send(JSON.stringify({
                            type: "error",
                            content: "I'm having trouble understanding. Could you please repeat that?"
                        }));
                    }
                    break;

                case "end_interview":
                    context.isInterviewActive = false;
                    ws.send(JSON.stringify({
                        type: "status",
                        content: "Interview ended. Thank you for participating."
                    }));
                    break;

                default:
                    ws.send(JSON.stringify({
                        type: "error",
                        content: "Invalid message type"
                    }));
            }
        } catch (error) {
            console.error("Error processing message:", error);
            ws.send(JSON.stringify({
                type: "error",
                content: "Error processing your message. Please try again."
            }));
        }
    });

    ws.on("close", () => {
        activeConnections--;
        interviewContexts.delete(ws);
        console.log(`Client disconnected. Total connections: ${activeConnections}`);
    });

    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
        activeConnections--;
        interviewContexts.delete(ws);
    });
});

// Clean up stale connections every minute
setInterval(() => {
    const now = Date.now();
    wss.clients.forEach((client) => {
        const context = interviewContexts.get(client);
        if (context && now - context.lastPing > 60000) {
            client.terminate();
            interviewContexts.delete(client);
            activeConnections--;
        }
    });
}, 60000);

const port = process.env.PORT || 3000;
server.listen(port, () => console.log(`Server running on port ${port}`));
