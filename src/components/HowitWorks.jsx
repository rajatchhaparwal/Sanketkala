import React from "react";
import { UploadCloud, Brain, FileCheck, Briefcase } from "lucide-react";
import step1Image from "../assets/herosectionimage.jpg"; // Replace with actual image paths
import step2Image from "../assets/herosectionimage.jpg";
import step3Image from "../assets/herosectionimage.jpg";
import step4Image from "../assets/herosectionimage.jpg";

const steps = [
  {
    title: "Upload Resume or Connect LinkedIn",
    description: "Easily import your details from LinkedIn or upload an existing resume.",
    icon: <UploadCloud size={50} className="text-blue-500" />,
    image: step1Image,
  },
  {
    title: "AI Scans & Optimizes",
    description: "Our AI analyzes your profile, checks for missing keywords, and improves your resume.",
    icon: <Brain size={50} className="text-green-500" />,
    image: step2Image,
  },
  {
    title: "Download Optimized Resume",
    description: "Get an ATS-friendly resume designed to boost your job search.",
    icon: <FileCheck size={50} className="text-purple-500" />,
    image: step3Image,
  },
  {
    title: "Receive Job Recommendations",
    description: "Find jobs that match your skills and get AI-powered career suggestions.",
    icon: <Briefcase size={50} className="text-orange-500" />,
    image: step4Image,
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 bg-gray-100">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">How It Works</h2>
        <div className="flex flex-col gap-12">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-center gap-10 ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Image Section */}
              <div className="w-full md:w-1/2 flex justify-center">
                <img src={step.image} alt={step.title} className="max-w-xs sm:max-w-sm md:max-w-md lg:max-w-lg" />
              </div>
              
              {/* Text Content */}
              <div className="w-full md:w-1/2 text-center md:text-left">
                <div className="flex items-center justify-center md:justify-start gap-4">
                  {step.icon}
                  <h3 className="text-2xl font-semibold text-gray-800">{step.title}</h3>
                </div>
                <p className="text-gray-600 mt-2">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;
