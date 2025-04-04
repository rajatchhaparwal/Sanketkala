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

wss.on("connection", (ws) => {
    console.log("Client connected");

    ws.on("message", async (message) => {
        const userSpeech = message.toString();
        console.log("User said:", userSpeech);

        const analysisPrompt = `Evaluate this answer: "${userSpeech}". Provide feedback and suggest improvements.`;
        try {
            const geminiResponse = await axios.post(
                `https://generativelanguage.googleapis.com/v1/models/gemini-pro:generateContent?key=${GEMINI_API_KEY}`,
                { contents: [{ parts: [{ text: analysisPrompt }] }] },
                { headers: { "Content-Type": "application/json" } }
            );

            const aiFeedback = geminiResponse.data?.candidates?.[0]?.content?.parts?.[0]?.text || "No response";
            console.log("AI Feedback:", aiFeedback);
            ws.send(aiFeedback);
        } catch (error) {
            console.error("Error fetching AI response:", error);
            ws.send("AI is not available right now.");
        }
    });

    ws.on("close", () => console.log("Client disconnected"));
});

server.listen(3000, () => console.log("Server running on port 3000"));
