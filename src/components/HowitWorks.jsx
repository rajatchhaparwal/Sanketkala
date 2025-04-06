import React from "react";
import { UploadCloud, Brain, FileCheck, Briefcase } from "lucide-react";
import {Link} from 'react-router-dom'

const steps = [
  {
    title: "Upload Resume or Connect LinkedIn",
    description: "Easily import your details from LinkedIn or upload an existing resume. This step ensures we have the most accurate and up-to-date information about your skills and experience.",
    icon: <UploadCloud size={50} className="text-blue-500" />,
    image: "https://cdn.gotresumebuilder.com/Content/Images/v3/hero_resume_1.png",
  },
  {
    title: "AI Scans & Optimizes",
    description: "Our AI thoroughly analyzes your profile, checks for missing keywords, formatting issues, and suggests improvements. This helps in making your resume more job-market ready and ATS-compliant.",
    icon: <Brain size={50} className="text-green-500" />,
    image: "https://geekflare.com/wp-content/uploads/2024/05/image-32.png",
  },
  {
    title: "Download Optimized Resume",
    description: "Once optimized, you can download a polished, ATS-friendly resume that highlights your strengths and ensures higher visibility in job applications.",
    icon: <FileCheck size={50} className="text-purple-500" />,
    image: "https://cdn.gotresumebuilder.com/Content/Images/v3/hero_resume_1.png",
  },
  {
    title: "Receive Job Recommendations",
    description: "Based on your resume and skillset, our AI suggests job opportunities that best match your profile. Get personalized job alerts to fast-track your job search.",
    icon: <Briefcase size={50} className="text-orange-500" />,
    image: "https://cdn.gotresumebuilder.com/Content/Images/v3/hero_resume_1.png",
  },
];

const HowItWorks = () => {
  return (
    <section className="py-16 w-full bg-gray-50">
      <div className="container mx-auto px-6">
        <h2 className="text-4xl font-bold text-gray-800 text-center mb-12">How It Works</h2>
        <div className="flex flex-col gap-16">
          {steps.map((step, index) => (
            <div
              key={index}
              className={`flex flex-col md:flex-row items-center gap-10 sm:w-full bg-white p-6 rounded-lg shadow-lg ${
                index % 2 === 0 ? "md:flex-row" : "md:flex-row-reverse"
              }`}
            >
              {/* Image Section */}
              <div className="w-full md:w-1/2 flex justify-center">
                <img
                  src={step.image}
                  alt={step.title}
                  className="rounded-lg shadow-md"
                />
              </div>
              
              {/* Text Content */}
              <div className="w-full md:w-1/2 text-center md:text-left p-4">
                <div className="flex items-center justify-center md:justify-start gap-4 mb-3">
                  {step.icon}
                  <h3 className="text-2xl font-semibold text-gray-800">{step.title}</h3>
                </div>
                <p className="text-gray-600 leading-relaxed">{step.description}</p>
              </div>
            </div>
          ))}
        </div>
        
        {/* Call-to-Action Button */}
        <div className="text-center mt-12">
          <button className="px-6 py-3 bg-amber-500 text-white font-semibold rounded-lg shadow-md hover:font-bold transition-colors">
           <Link to={'/Getstarted'}>Get Started Now</Link>  
          </button>
        </div>
      </div>
    </section>
  );
};

export default HowItWorks;