import express from 'express';
import 'dotenv/config';
import { google } from '@ai-sdk/google';
import { generateText } from 'ai';
import { collection, addDoc } from "firebase/firestore";
import { db } from '../src/Auth/firebase.js';
import { getAuth } from "firebase/auth";  

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
  return res.json({ status: true, data: "Hello, API is working!" });
});

app.post('/', async (req, res) => {
  try {
    const { type, role, level, techstack, amount, userid } = req.body;


    if (!type || !role || !level || !techstack || !amount || !userid) {
      return res.status(400).json({ success: false, error: "Missing required fields." });
    }

   
    const response = await generateText({
      model: google('gemini-2.0-flash-001'),
      prompt: `You are an AI assistant that generates structured interview questions.

The job role is: "${role}".
The candidate's experience level is: "${level}".
The required tech stack is: "${techstack}".
The interview will focus on: "${type}" questions (e.g., behavioral, technical, or both).
Generate exactly "${amount}" interview questions.

**Output Format Guidelines:**
- Respond with **only** a valid JSON array.
- No explanations, extra text, or markdown formatting.
- Example output:
  ["What is polymorphism?", "How does garbage collection work?", "Explain closures in JavaScript."]

IMPORTANT: Only return the JSON array with questions, nothing else.
`
    });


    const rawText = response.text.trim();
    console.log(" AI Raw Response:", rawText);

    const jsonMatch = rawText.match(/\[.*\]/s);
    if (!jsonMatch) {
      throw new Error("AI response does not contain a valid JSON array.");
    }

    let parsedQuestions = JSON.parse(jsonMatch[0]);

    if (!Array.isArray(parsedQuestions)) {
      throw new Error("Parsed AI response is not a JSON array.");
    }

    const interview = {
      type,
      role,
      level,
      techstack,
      questions: parsedQuestions,
      userId: userid,
      finalized: true,
      createdAt: new Date().toISOString(),
    };

   
    await addDoc(collection(db, "interviews"), interview);

    return res.status(201).json({ success: true, message: "Interview created successfully!", data: interview });

  } catch (error) {
    console.error("Error:", error);
    return res.status(500).json({ success: false, error: error.message || "An unexpected error occurred." });
  }
});


app.listen(port, () => {
  console.log(`Server listening on port ${port}`);
});
