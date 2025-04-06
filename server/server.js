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

// Store interview questions for different types
const interviewQuestions = {
    'full-stack-interview': [
        "Tell me about your experience with full-stack development.",
        "What's your preferred tech stack and why?",
        "Explain how you would design a scalable web application.",
        "How do you handle state management in your applications?",
        "Describe a challenging project you worked on."
    ],
    'front-end-development-interview': [
        "What are your favorite frontend frameworks?",
        "How do you optimize website performance?",
        "Explain the concept of responsive design.",
        "How do you handle cross-browser compatibility issues?",
        "What's your approach to CSS organization?"
    ],
    // Add more interview types as needed
};

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
        lastPing: Date.now(),
        currentQuestionIndex: 0,
        currentInterviewType: null
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
                    context.currentInterviewType = data.interviewType;
                    const questions = interviewQuestions[data.interviewType] || interviewQuestions['full-stack-interview'];
                    
                    // Send first question
                    ws.send(JSON.stringify({
                        type: "ai_response",
                        content: `Welcome to your ${data.interviewType.replace(/-/g, ' ')}! ${questions[0]}`
                    }));
                    context.currentQuestionIndex = 1;
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

                    // Get questions for current interview type
                    const questionsForInterview = interviewQuestions[context.currentInterviewType] || interviewQuestions['full-stack-interview'];
                    
                    if (context.currentQuestionIndex < questionsForInterview.length) {
                        // Send next question
                        setTimeout(() => {
                            ws.send(JSON.stringify({
                                type: "ai_response",
                                content: questionsForInterview[context.currentQuestionIndex]
                            }));
                            context.currentQuestionIndex++;
                        }, 1000); // Add a small delay to make it feel more natural
                    } else {
                        // Interview finished
                        ws.send(JSON.stringify({
                            type: "ai_response",
                            content: "Thank you for completing the interview! You did well. Is there anything else you'd like to discuss?"
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
