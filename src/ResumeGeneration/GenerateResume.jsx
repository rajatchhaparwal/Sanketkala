import React, { useState } from "react";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function GenerateResume() {
  const [linkedin, setLinkedin] = useState("");

  const handleGenerateResume = (e) => {
    e.preventDefault();
    console.log("Generating resume for:", linkedin);
    // Implement resume generation logic here
  };

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100 p-6">
      <div className="bg-white shadow-lg rounded-lg p-6 w-full max-w-lg">
        <h2 className="text-2xl font-semibold mb-4">Generate Your Resume</h2>
        <form onSubmit={handleGenerateResume} className="flex gap-2">
          <input
            type="text"
            placeholder="Enter your LinkedIn profile url"
            value={linkedin}
            onChange={(e) => setLinkedin(e.target.value)}
            className="border border-gray-300 rounded-md p-2 flex-grow focus:ring-2"
          />
          <button
            type="submit"
            className="bg-amber-500 text-white px-4 py-2 rounded-md hover:font-bold"
          >
            Generate
          </button>
        </form>
      </div>

      <div className="mt-10 w-full max-w-4xl">
        <h3 className="text-xl font-semibold mb-4">Choose a Template</h3>
        <div className="grid grid-cols-2 md:grid-cols-3 gap-4">

          {[1, 2, 3, 4, 5,6].map((template, index) => (
            <div
              key={index}
              className="bg-gray-200 h-40 flex items-center justify-center text-gray-500 font-semibold rounded-lg cursor-pointer hover:bg-gray-300"
            >
              Template {index + 1}
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
}
