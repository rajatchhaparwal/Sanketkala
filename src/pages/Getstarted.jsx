import React from "react";
import { Link } from "react-router-dom";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

const Getstarted = () => {
  const services = [
    {
      name: "Generate Resume",
      description: "Create an AI-powered professional resume tailored to your target job and prepare for your interview",
      value: "/generateResume",
      image:
        "https://img.freepik.com/premium-vector/resume-concept-woman-makes-resume-vector-illustration-flat_186332-971.jpg",
    },
    {
      name: "Take an Interview",
      description: "Practice with our AI interviewer based on your generated resume to improve your skills",
      value: "/interview",
      image:
        "https://cdn.pixabay.com/photo/2023/09/23/09/02/interview-8270514_640.png",
    },
    {
      name: "Optimize LinkedIn Profile",
      description: "Get recommendations to make your LinkedIn profile stand out",
      value: "/linkedin",
      image:
        "https://img.freepik.com/free-vector/blog-post-concept-illustration_114360-164.jpg",
    },
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen flex items-center justify-center bg-gray-100 p-4">
        <div className="max-w-screen-lg w-full p-6 bg-white shadow-lg rounded-lg text-center">
          <h1 className="text-2xl md:text-3xl font-bold mb-6">
            Choose a Service to Begin
          </h1>
          <div className="grid md:grid-cols-3 gap-6">
            {services.map((service) => (
              <div
                key={service.value}
                className="bg-gray-200 p-4 rounded-lg shadow-md hover:shadow-xl transition-all duration-300 transform hover:-translate-y-1"
              >
                <img
                  src={service.image}
                  alt={service.name}
                  className="w-full h-40 lg:h-60 object-cover rounded-md mb-4 transition-transform duration-300 hover:scale-105"
                />
                <h3 className="text-lg font-semibold mb-2">{service.name}</h3>
                <p className="text-gray-600 mb-4">{service.description}</p>
                <Link
                  to={service.value}
                  className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 active:scale-95 transition-all w-full block"
                >
                  Get Started
                </Link>
              </div>
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Getstarted;
