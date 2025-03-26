import React from "react";
import { Briefcase, Users, GraduationCap, BarChart } from "lucide-react";
const features = [
  {
    icon: <Briefcase size={40} className="text-blue-500" />,
    title: "AI Resume Builder",
    description: "Generate professional resumes tailored to your skills and experience with AI.",
  },
  {
    icon: <Users size={40} className="text-green-500" />,
    title: "LinkedIn Profile Optimization",
    description: "Enhance your LinkedIn profile with AI-driven insights and recommendations.",
  },
  {
    icon: <Users size={40} className="text-indigo-500" />,
    title: "Job Match & Recommendations",
    description: "Find the best job opportunities based on your skills and experience.",
  },
  {
    icon: <GraduationCap size={40} className="text-red-500" />,
    title: "AI-Powered Cover Letter",
    description: "Generate customized cover letters that align with job descriptions.",
  },
];


const Features = () => {
  return (
    <section className="p-3 lg:pt-10 flex flex-col items-center justify-center bg-gray-100 px-6">
      <h2 className="text-xl md:text-2xl lg:text-4xl font-bold text-center text-gray-800 mb-8">Features</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 w-full max-w-6xl">
        {features.map((feature, index) => (
          <div key={index} className="p-6 bg-white shadow-lg rounded-xl flex flex-col items-center text-center">
            <div className="mb-4">{feature.icon}</div>
            <h3 className="text-xl font-semibold text-gray-800">{feature.title}</h3>
            <p className="text-gray-600 mt-2">{feature.description}</p>
          </div>
        ))}
      </div>
    </section>
  );
};

export default Features;
