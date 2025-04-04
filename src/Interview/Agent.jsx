import { useEffect, useState } from "react";


// const CallStatus = {
//   INACTIVE: "INACTIVE",
//   CONNECTING: "CONNECTING",
//   ACTIVE: "ACTIVE",
//   FINISHED: "FINISHED",
// };

const Agent = () => {
  // const [callStatus, setCallStatus] = useState(CallStatus.INACTIVE);
  // const [isSpeaking, setIsSpeaking] = useState(false);
  // const [messages, setMessages] = useState([]);

  // useEffect(() => {
  //   const onCallStart = () => setCallStatus(CallStatus.ACTIVE);
  //   const onCallEnd = () => setCallStatus(CallStatus.FINISHED);
  //   const onSpeechStart = () => setIsSpeaking(true);
  //   const onSpeechEnd = () => setIsSpeaking(false);
  //   const onMessage = (message) => setMessages((prev) => [...prev, message]);
  //   const onError = (error) => console.error("Vapi Error:", error);

  // const handleCall = async () => {
  //   setCallStatus(CallStatus.CONNECTING);
  //   await vapi.start(process.env.REACT_APP_VAPI_WORKFLOW_ID, {
  //     variableValues: {
  //       username: userName,
  //       userid: userId,
  //     },
  //   });
  // };

  // const handleDisconnect = async () => {
  //   setCallStatus(CallStatus.FINISHED);
  //   vapi.stop();
  // };

  // const lastMessage = messages[messages.length - 1]?.content || "No messages yet.";

  return (
    <>
      <div className="flex flex-col lg:flex-row justify-center gap-8 p-4 bg-gray-100">
        {/* AI Interviewer Card */}
        <div className="flex flex-col items-center justify-center">
          <div className="bg-white max-w-xs md:max-w-sm lg:w-[400px] text-center shadow-lg rounded-lg p-6 w-full transition-transform duration-300 hover:shadow-xl hover:-translate-y-2">
            <img
              src="https://cdn-icons-png.flaticon.com/512/9165/9165147.png"
              alt="Agent"
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
            <h2 className="text-xl lg:text-2xl font-semibold mb-4">user</h2>
          </div>
        </div>
      </div>

      <div className="flex items-center justify-center m-5">
        {/* <h1 key={lastMessage} className="bg-black text-white px-4 rounded-2xl py-2 text-center">
          {lastMessage}
        </h1> */}
      </div>

      {/* Call Button */}
      {/* <div className="flex justify-center mt-4">
        {callStatus !== CallStatus.ACTIVE ? (
          <button
            className="px-4 py-2 lg:px-6 lg:py-3 bg-amber-500 text-white font-semibold rounded-md shadow-md hover:font-bold transition duration-200"
            onClick={handleCall}
          >
            <span>{callStatus === CallStatus.INACTIVE || callStatus === CallStatus.FINISHED ? "Call" : "...."}</span>
          </button>
        ) : (
          <button
            className="px-4 py-2 lg:px-6 lg:py-3 bg-red-500 text-white font-semibold rounded-md shadow-md hover:font-bold transition duration-200"
            onClick={handleDisconnect}
          >
            End
          </button>
        )} */}
    </>
  );
};

export default Agent;