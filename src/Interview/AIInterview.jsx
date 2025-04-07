import React, { useState, useEffect } from "react";
import { auth, db } from "../Auth/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { Link } from 'react-router-dom';

const AIInterview = () => {
    const [ws, setWs] = useState(null);
    const [aiResponse, setAiResponse] = useState("");
    const [userResponse, setUserResponse] = useState("");
    const [user, setUser] = useState(null);
    const [isInterviewActive, setIsInterviewActive] = useState(false);
    const [isListening, setIsListening] = useState(false);
    const [connectionError, setConnectionError] = useState(false);
    const [speechError, setSpeechError] = useState(null);
    const [isSpeaking, setIsSpeaking] = useState(false);

    // Check for speech recognition support
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    const hasSpeechSupport = !!SpeechRecognition;

    // Cancel any ongoing speech
    const cancelSpeech = () => {
        window.speechSynthesis.cancel();
        setIsSpeaking(false);
    };

    // Cleanup speech synthesis on unmount
    useEffect(() => {
        return () => {
            cancelSpeech();
        };
    }, []);

    // Get Firebase Auth user
    useEffect(() => {
        auth.onAuthStateChanged((currentUser) => {
            setUser(currentUser);
        });
    }, []);

    // Initialize WebSocket connection
    useEffect(() => {
        let reconnectAttempts = 0;
        const maxReconnectAttempts = 3;
        let reconnectTimeout;

        const connectWebSocket = () => {
            const wsUrl = window.location.hostname === 'localhost'
                ? 'ws://localhost:3000/ws'
                : 'wss://sanketkala-server.vercel.app/ws';

            console.log('Connecting to WebSocket at:', wsUrl);
            const socket = new WebSocket(wsUrl);

            socket.onopen = () => {
                console.log("WebSocket connected");
                setConnectionError(false);
                reconnectAttempts = 0;
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
                            // Cancel any ongoing speech before starting new one
                            cancelSpeech();
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

            socket.onclose = (event) => {
                console.log("WebSocket disconnected", event.code, event.reason);
                setIsInterviewActive(false);
                cancelSpeech(); // Cancel any ongoing speech when connection closes
                
                if (event.code !== 1000 && event.code !== 1001) {
                    if (reconnectAttempts < maxReconnectAttempts) {
                        console.log(`Attempting to reconnect... (${reconnectAttempts + 1}/${maxReconnectAttempts})`);
                        reconnectTimeout = setTimeout(() => {
                            reconnectAttempts++;
                            connectWebSocket();
                        }, 3000);
                    } else {
                        setConnectionError(true);
                        console.log("Max reconnection attempts reached");
                    }
                }
            };

            socket.onerror = (error) => {
                console.error("WebSocket error:", error);
                setConnectionError(true);
            };

            return socket;
        };

        const socket = connectWebSocket();
        setWs(socket);

        return () => {
            if (reconnectTimeout) {
                clearTimeout(reconnectTimeout);
            }
            if (socket.readyState === WebSocket.OPEN) {
                socket.send(JSON.stringify({
                    type: "end_interview"
                }));
                socket.close();
            }
            cancelSpeech(); // Cancel any ongoing speech when component unmounts
        };
    }, [user]);

    // Request microphone permission
    const requestMicrophonePermission = async () => {
        try {
            const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
            stream.getTracks().forEach(track => track.stop()); // Stop the stream after getting permission
            setSpeechError(null);
            return true;
        } catch (error) {
            console.error('Microphone permission error:', error);
            setSpeechError('Please allow microphone access to use the interview feature.');
            return false;
        }
    };

    // Speech recognition
    const listenToUser = async () => {
        if (!hasSpeechSupport) {
            setSpeechError('Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.');
            return;
        }

        if (!isInterviewActive) {
            console.log("Interview not active");
            return;
        }

        // Request microphone permission first
        const hasPermission = await requestMicrophonePermission();
        if (!hasPermission) return;

        setIsListening(true);
        setSpeechError(null);

        try {
            const recognition = new SpeechRecognition();
            recognition.lang = "en-US";
            recognition.continuous = false;
            recognition.interimResults = false;

            recognition.onstart = () => {
                setIsListening(true);
                setSpeechError(null);
            };

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
                switch (event.error) {
                    case 'no-speech':
                        setSpeechError('No speech was detected. Please try again.');
                        break;
                    case 'audio-capture':
                        setSpeechError('No microphone was found. Please ensure your microphone is connected.');
                        break;
                    case 'not-allowed':
                        setSpeechError('Microphone permission was denied. Please allow microphone access.');
                        break;
                    case 'network':
                        setSpeechError('Network error occurred. Please check your internet connection.');
                        break;
                    default:
                        setSpeechError('An error occurred with speech recognition. Please try again.');
                }
            };

            recognition.start();
        } catch (error) {
            console.error('Speech recognition initialization error:', error);
            setIsListening(false);
            setSpeechError('Failed to initialize speech recognition. Please try again.');
        }
    };

    // Text-to-Speech
    const speak = (text) => {
        // Don't start new speech if already speaking
        if (isSpeaking) {
            return;
        }

        const speech = new SpeechSynthesisUtterance(text);
        speech.lang = "en-US";
        speech.rate = 1;
        speech.pitch = 1;

        speech.onstart = () => {
            setIsSpeaking(true);
        };

        speech.onend = () => {
            setIsSpeaking(false);
        };

        speech.onerror = () => {
            setIsSpeaking(false);
        };

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
            <div className="bg-blue-50 p-4 mb-6 rounded-lg shadow-sm">
                <div className="max-w-4xl mx-auto text-center">
                    <h3 className="text-lg font-semibold text-blue-700 mb-2">Prepare for your interview with confidence!</h3>
                    <p className="text-gray-700 mb-3">Having a great resume is the first step. If you haven't created your AI-optimized resume yet, try our resume generator.</p>
                    <Link to="/generateResume" className="text-blue-600 hover:text-blue-800 font-medium">
                        ← Generate your resume first
                    </Link>
                </div>
            </div>
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
                        {!hasSpeechSupport ? (
                            <p className="text-red-600 mb-4">
                                Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.
                            </p>
                        ) : (
                            <>
                                <div className="flex gap-4">
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
                                    {isSpeaking && (
                                        <button
                                            onClick={cancelSpeech}
                                            className="px-6 py-2 rounded-lg shadow-md transition duration-300 bg-red-500 hover:bg-red-700 text-white"
                                        >
                                            Stop AI Speaking
                                        </button>
                                    )}
                                </div>
                                {speechError && (
                                    <p className="mt-4 text-red-600">{speechError}</p>
                                )}
                            </>
                        )}
                        {!isInterviewActive && !speechError && (
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
