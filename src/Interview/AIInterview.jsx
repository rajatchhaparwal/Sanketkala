import React, { useState, useEffect } from "react";
import { auth, db } from "../Auth/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const AIInterview = () => {
    const [ws, setWs] = useState(null);
    const [aiResponse, setAiResponse] = useState("");
    const [userResponse, setUserResponse] = useState("");
    const [user, setUser] = useState(null);
    

    // Get Firebase Auth user
    useEffect(() => {
        auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });
    }, []);

    // Initialize WebSocket connection
    useEffect(() => {
        const socket = new WebSocket("ws://localhost:3000/ws");

        socket.onopen = () => console.log("WebSocket connected");
        socket.onmessage = (event) => {
            setAiResponse("AI: " + event.data);
            speak(event.data);

            // Save AI response to Firestore
            if (user) {
                saveToFirestore(user.email, "AI", event.data);
            }
        };
        socket.onclose = () => console.log("WebSocket disconnected");

        setWs(socket);
        return () => socket.close();
    }, [user]);

      


    // Speech recognition
    const listenToUser = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.start();
        setUserResponse("User: Hello, AI!");
        setAiResponse("AI: Hi! Let's begin the interview.");

        recognition.onresult = (event) => {
            const userSpeech = event.results[0][0].transcript;
            setUserResponse("User: " + userSpeech);
            if (ws) ws.send(userSpeech);

            // Save user response to Firestore
            if (user) {
                saveToFirestore(user.email, "User", userSpeech);
            }
        };

        recognition.onerror = (event) => console.log("Speech recognition error:", event);
    };

    // Text-to-Speech
    const speak = (text) => {
        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.rate = 1;
        speech.pitch = 1;
        window.speechSynthesis.speak(speech);
    };

    // Save data to Firestore
    const saveToFirestore = async (email, role, message) => {
        try {
            await addDoc(collection(db, "interviews"), {
                email,
                role,
                message,
                timestamp: serverTimestamp(),
            });
        } catch (error) {
            console.error("Error saving to Firestore:", error);
        }
    };

    return (
        <>
        <div className="flex flex-col lg:flex-row justify-center gap-8 p-4 bg-gray-100">
        {/* AI Interviewer Card */}
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white max-w-xs md:max-w-sm lg:w-[400px] text-center shadow-lg rounded-lg p-6 w-full transition-transform duration-300 hover:shadow-xl hover:-translate-y-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/9165/9165147.png"
              alt="AI Interviewer"
              className="h-32 w-32 lg:h-40 lg:w-40 mx-auto rounded-md mb-4 animate-pulse"
            />
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">AI Interviewer</h2>
          </div>
        </div>
  
        {/* User Card */}
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white max-w-xs md:max-w-sm lg:w-[400px] text-center shadow-lg rounded-lg p-6 w-full transition-transform duration-300 hover:shadow-xl hover:-translate-y-2">
            <img
              src="https://randomuser.me/api/portraits/men/46.jpg"
              alt="User"
              className="h-32 w-32 lg:h-40 lg:w-40 mx-auto rounded-full mb-4"
            />
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">User</h2>
          </div>
        </div>
      </div>
  
      <div className="flex flex-col items-center justify-center text-center mt-">
        {user ? (
          <>
            <button
              onClick={listenToUser}
              className="bg-blue-500 text-white px-6 py-2 rounded-lg shadow-md hover:bg-blue-700 transition duration-300"
            >
              Start Interview
            </button>
            <p className="mt-4 bg-gray-900 text-white px-4 py-2 rounded-lg">{userResponse}</p>
            <p className="mt-2 bg-gray-700 text-white px-4 py-2 rounded-lg">{aiResponse}</p>
          </>
        ) : (
          <p className="text-red-600 font-semibold">Please log in to start the interview.</p>
        )}
      </div>
      </>
    );
};

export default AIInterview;
