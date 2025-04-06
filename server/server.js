import express from "express";
import http from "http";
import { WebSocketServer } from "ws";
import cors from "cors";
import axios from "axios";
import dotenv from "dotenv";

dotenv.config();
const app = express();
const server = http.createServer(app);

const wss = new WebSocketServer({ server, path: "/ws" });
app.use(cors());
app.use(express.json());

const GEMINI_API_KEY = process.env.GOOGLE_GENERATIVE_AI_API_KEY;
const MAX_CONNECTIONS = 10; // Limit concurrent connections
let activeConnections = 0;

// Store interview context for each connection
const interviewContexts = new Map();

wss.on("connection", (ws) => {
    if (activeConnections >= MAX_CONNECTIONS) {
        ws.close(1008, "Server is at maximum capacity");
        return;
    }

    activeConnections++;
    console.log(`New client connected. Total connections: ${activeConnections}`);
    
    // Initialize interview context for this connection
    const context = {
        messages: [],
        isInterviewActive: false
    };
    interviewContexts.set(ws, context);

    ws.on("message", async (message) => {
        try {
            const data = JSON.parse(message);
            const { type, content } = data;

            switch (type) {
                case "start_interview":
                    context.isInterviewActive = true;
                    context.messages = [];
                    ws.send(JSON.stringify({
                        type: "status",
                        content: "Interview started. You can begin speaking."
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
                    Provide constructive feedback and ask a relevant follow-up question. 
                    Previous context: ${JSON.stringify(context.messages.slice(-3))}`;

                    try {
                        const geminiResponse = await axios.post(
                            `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
                            { contents: [{ parts: [{ text: analysisPrompt }] }] },
                            { headers: { "Content-Type": "application/json" } }
                        );

                        const aiFeedback = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
                        context.messages.push({ role: "assistant", content: aiFeedback });
                        
                        ws.send(JSON.stringify({
                            type: "ai_response",
                            content: aiFeedback
                        }));
                    } catch (error) {
                        console.error("Error fetching AI response:", error);
                        ws.send(JSON.stringify({
                            type: "error",
                            content: "AI is not available right now. Please try again."
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
                content: "Error processing your message"
            }));
        }
    });

    ws.on("close", () => {
        activeConnections--;
        interviewContexts.delete(ws);
        console.log(`Client disconnected. Total connections: ${activeConnections}`);
    });

    // Handle errors
    ws.on("error", (error) => {
        console.error("WebSocket error:", error);
        activeConnections--;
        interviewContexts.delete(ws);
    });
});

server.listen(3000, () => console.log("Server running on port 3000"));
