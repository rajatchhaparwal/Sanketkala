import React, { useState, useEffect } from "react";
import { useParams, useLocation, useNavigate } from "react-router-dom";
import { auth, db } from "../Auth/firebase";
import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";

const AIInterview = () => {
    const { type } = useParams();
    const location = useLocation();
    const navigate = useNavigate();
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
        const unsubscribe = auth.onAuthStateChanged((currentUser) => {
            if (!currentUser) {
                navigate('/login');
            }
            setUser(currentUser);
        });

        return () => unsubscribe();
    }, [navigate]);

    // Initialize WebSocket connection
    useEffect(() => {
        if (!user) return;

        let reconnectAttempts = 0;
        const maxReconnectAttempts = 3;
        let reconnectTimeout;

        const connectWebSocket = () => {
            const wsUrl = 'ws://localhost:3000/ws';

            console.log('Connecting to WebSocket at:', wsUrl);
            const socket = new WebSocket(wsUrl);

            socket.onopen = () => {
                console.log("WebSocket connected");
                setConnectionError(false);
                reconnectAttempts = 0;
                socket.send(JSON.stringify({
                    type: "start_interview",
                    interviewType: type,
                    userEmail: user.email // Add user email for tracking
                }));
                setIsInterviewActive(true);
            };

            socket.onmessage = (event) => {
                try {
                    const response = JSON.parse(event.data);
                    console.log("Received message:", response); // Add logging
                    switch (response.type) {
                        case "ai_response":
                            setAiResponse(response.content);
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
                        default:
                            console.log("Unknown message type:", response.type);
                    }
                } catch (error) {
                    console.error("Error parsing WebSocket message:", error);
                }
            };

            socket.onclose = (event) => {
                console.log("WebSocket disconnected", event.code, event.reason);
                setIsInterviewActive(false);
                cancelSpeech();
                
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
            cancelSpeech();
        };
    }, [user, type]);

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
            <Navbar />
            <div className="min-h-screen bg-gradient-to-b from-gray-50 to-gray-100 py-8">
                <div className="container mx-auto px-4">
                    <div className="max-w-4xl mx-auto">
                        <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                            <h1 className="text-3xl font-bold text-gray-800 mb-2">
                                {type ? type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ') : 'Technical Interview'}
                            </h1>
                            <p className="text-gray-600 mb-6">
                                Your AI interviewer will ask questions related to {type ? type.replace(/-/g, ' ') : 'technical topics'}
                            </p>

                            {/* Connection Status */}
                            {connectionError ? (
                                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                                    Connection error. Please check your internet connection and try again.
                                </div>
                            ) : !isInterviewActive ? (
                                <div className="bg-yellow-50 text-yellow-600 p-4 rounded-lg mb-6">
                                    Please wait for the interview to start...
                                </div>
                            ) : null}

                            {/* Speech Support Warning */}
                            {!hasSpeechSupport && (
                                <div className="bg-yellow-50 text-yellow-600 p-4 rounded-lg mb-6">
                                    Speech recognition is not supported in your browser. Please use Chrome, Edge, or Safari.
                                </div>
                            )}

                            {/* Speech Error */}
                            {speechError && (
                                <div className="bg-red-50 text-red-600 p-4 rounded-lg mb-6">
                                    {speechError}
                                </div>
                            )}

                            {/* AI Response Card */}
                            <div className="bg-blue-50 rounded-lg p-6 mb-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-blue-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M9.75 17L9 20l-1 1h8l-1-1-.75-3M3 13h18M5 17h14a2 2 0 002-2V5a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
                                        </svg>
                                    </div>
                                    <h3 className="ml-3 text-lg font-semibold text-blue-900">AI Interviewer</h3>
                                </div>
                                <p className="text-blue-800">{aiResponse || "Preparing your interview questions..."}</p>
                            </div>

                            {/* User Response Card */}
                            <div className="bg-gray-50 rounded-lg p-6">
                                <div className="flex items-center mb-4">
                                    <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center">
                                        <svg className="w-6 h-6 text-gray-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                    <h3 className="ml-3 text-lg font-semibold text-gray-900">Your Response</h3>
                                </div>
                                <p className="text-gray-800 mb-4">{userResponse || "Your response will appear here..."}</p>
                                
                                <button
                                    onClick={listenToUser}
                                    disabled={!isInterviewActive || isListening || !hasSpeechSupport}
                                    className={`w-full flex items-center justify-center px-4 py-2 rounded-lg ${
                                        isListening
                                            ? 'bg-red-500 hover:bg-red-600'
                                            : 'bg-blue-500 hover:bg-blue-600'
                                    } text-white transition-colors duration-300 disabled:opacity-50 disabled:cursor-not-allowed`}
                                >
                                    <svg className="w-5 h-5 mr-2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                                    </svg>
                                    {isListening ? 'Stop Speaking' : 'Start Speaking'}
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            </div>
            <Footer />
        </>
    );
};

export default AIInterview;
