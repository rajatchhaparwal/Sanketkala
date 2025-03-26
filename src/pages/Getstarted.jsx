import React from "react";
import { Link} from 'react-router-dom'
import Navbar from '../components/Navbar'
import Footer from '../components/Footer'
const Getstarted = ({ onSelectService }) => {
  const services = [
    { name: "Generate Resume", value: "/GenerateResume", image: "https://img.freepik.com/premium-vector/resume-concept-woman-makes-resume-vector-illustration-flat_186332-971.jpg" },
    { name: "Take an Interview", value:"/Interview", image: "https://cdn.pixabay.com/photo/2023/09/23/09/02/interview-8270514_640.png" },
    { name: "Optimize LinkedIn Profile", value: "linkedin", image: "https://img.freepik.com/free-vector/blog-post-concept-illustration_114360-164.jpg" },
  ];

  return (
    <>
    <Navbar/>
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="max-w-screen w-full p-6 h-full bg-white shadow-lg rounded-lg text-center">
        <h1 className=" sm:text-xl md:text-2xl lg:text-3xl font-bold mb-6">Choose a service to begin</h1>
        <div className="grid md:grid-cols-3 gap-6">
          {services.map((service) => (
            <div key={service.value} className="bg-gray-200 p-4 lg:w-full rounded-lg shadow-md hover:shadow-lg transition">
              <img src={service.image} alt={service.name} className="w-full h-40 lg:h-80 object-cover rounded-md mb-4" />
              <Link
                className="bg-blue-600 text-white py-2 px-4 rounded-lg hover:bg-blue-700 transition w-full"
                to={service.value}
              >
                {service.name}
              </Link>
            </div>
          ))}
        </div>
      </div>
    </div>
    <Footer/>
    </>
  );
};

export default Getstarted;
