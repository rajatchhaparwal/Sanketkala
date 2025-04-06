import React, { useState, useEffect } from "react";
import { auth, db } from "../Auth/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";

const AIInterview = () => {
    const [ws, setWs] = useState(null);
    const [aiResponse, setAiResponse] = useState("");
    const [userResponse, setUserResponse] = useState("");
    const [user, setUser] = useState(null);
    const [isInterviewActive, setIsInterviewActive] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [connectionError, setConnectionError] = useState(false);

    // Get Firebase Auth user
    useEffect(() => {
        auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });
    }, []);

    // Initialize WebSocket connection
    useEffect(() => {
        const wsUrl = process.env.NODE_ENV === 'production' 
            ? 'wss://sanketkala-server.vercel.app/ws'  // Production URL
            : 'ws://localhost:3000/ws';  // Development URL

        console.log('Connecting to WebSocket at:', wsUrl);
        const socket = new WebSocket(wsUrl);

        socket.onopen = () => {
            console.log("WebSocket connected");
            setConnectionError(false);
            // Start the interview when connection is established
            socket.send(JSON.stringify({
                type: "start_interview"
            }));
            setIsInterviewActive(true);
        };

        socket.onmessage = (event) => {
            try {
                const response = JSON.parse(event.data);
                switch (response.type) {
                    case "ai_response":
                        setAiResponse(response.content);
                        speak(response.content);
                        if (user) {
                            saveToFirestore(user.email, "AI", response.content);
                        }
                        break;
                    case "status":
                        console.log("Status:", response.content);
                        break;
                    case "error":
                        console.error("Error:", response.content);
                        setAiResponse(response.content);
                        break;
                }
            } catch (error) {
                console.error("Error parsing WebSocket message:", error);
            }
        };

        socket.onclose = () => {
            console.log("WebSocket disconnected");
            setIsInterviewActive(false);
            setConnectionError(true);
        };

        socket.onerror = (error) => {
            console.error("WebSocket error:", error);
            setConnectionError(true);
            setIsInterviewActive(false);
        };

        setWs(socket);
        return () => {
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: "end_interview"
                }));
                socket.close();
            }
        };
    }, [user]);

    // Speech recognition
    const listenToUser = () => {
        if (!isInterviewActive) {
            console.log("Interview not active");
            return;
        }

        setIsListening(true);
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = "en-US";
        recognition.continuous = false;
        recognition.start();

        recognition.onresult = (event) => {
            const userSpeech = event.results[0][0].transcript;
            setUserResponse(userSpeech);
            
            if (ws && ws.readyState === WebSocket.OPEN) {
                ws.send(JSON.stringify({
                    type: "user_speech",
                    content: userSpeech
                }));
            }

            if (user) {
                saveToFirestore(user.email, "User", userSpeech);
            }
        };

        recognition.onend = () => {
            setIsListening(false);
        };

        recognition.onerror = (event) => {
            console.log("Speech recognition error:", event);
            setIsListening(false);
        };
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
                        <div className="bg-gray-100 p-4 rounded-lg min-h-[100px]">
                            <p className="text-gray-800">{aiResponse}</p>
                        </div>
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
                        <div className="bg-gray-100 p-4 rounded-lg min-h-[100px]">
                            <p className="text-gray-800">{userResponse}</p>
                        </div>
                    </div>
                </div>
            </div>

            <div className="flex flex-col items-center justify-center text-center mt-8">
                {user ? (
                    <>
                        <button
                            onClick={listenToUser}
                            disabled={!isInterviewActive || isListening}
                            className={`px-6 py-2 rounded-lg shadow-md transition duration-300 ${
                                !isInterviewActive || isListening
                                    ? "bg-gray-400 cursor-not-allowed"
                                    : "bg-blue-500 hover:bg-blue-700 text-white"
                            }`}
                        >
                            {isListening ? "Listening..." : "Speak"}
                        </button>
                        {!isInterviewActive && (
                            <div className="mt-4">
                                {connectionError ? (
                                    <p className="text-red-600">Failed to connect to the interview server. Please try again later.</p>
                                ) : (
                                    <p className="text-amber-600">Please wait for the interview to start...</p>
                                )}
                            </div>
                        )}
                    </>
                ) : (
                    <p className="text-red-600 font-semibold">Please log in to start the interview.</p>
                )}
            </div>
        </>
    );
};

export default AIInterview;
