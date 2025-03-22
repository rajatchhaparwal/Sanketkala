import React from "react";
import { Briefcase, Users, GraduationCap, BarChart } from "lucide-react";

const features = [
  {
    icon: <Briefcase size={40} className="text-blue-500" />,
    title: "Job Search & Hiring",
    description: "Find job opportunities and connect with recruiters to grow your career.",
  },
  {
    icon: <Users size={40} className="text-green-500" />,
    title: "Professional Networking",
    description: "Build connections, engage with professionals, and expand your network.",
  },
  {
    icon: <GraduationCap size={40} className="text-purple-500" />,
    title: "Learning & Courses",
    description: "Access professional courses and enhance your skills with LinkedIn Learning.",
  },
  {
    icon: <BarChart size={40} className="text-orange-500" />,
    title: "Company Insights",
    description: "Get insights about companies, salaries, and market trends to make informed decisions.",
  },
];

const Features = () => {
  return (
    <section className="h-screen flex flex-col items-center justify-center bg-gray-100 px-6">
      <h2 className="text-4xl font-bold text-center text-gray-800 mb-8">LinkedIn Features</h2>
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
