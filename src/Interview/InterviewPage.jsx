import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import InterviewCard from './interviewCard';

const InterviewPage = () => {
  const interviews = [
    {
      title: "Full Stack Interview",
      description: "Practice full stack development interview questions covering both frontend and backend technologies.",
      techStack: ["HTML5", "CSS3", "JavaScript", "React", "Node", "MongoDB"],
      color: "orange"
    },
    {
      title: "Front End Development Interview",
      description: "Focus on frontend development concepts, UI/UX principles, and modern JavaScript frameworks.",
      techStack: ["HTML5", "CSS3", "JavaScript", "React"],
      color: "blue"
    },
    {
      title: "Backend Development Interview",
      description: "Deep dive into server-side programming, databases, and API development concepts.",
      techStack: ["Node", "MongoDB", "JavaScript"],
      color: "green"
    },
    {
      title: "MERN Stack Interview",
      description: "Comprehensive interview covering MongoDB, Express.js, React, and Node.js development.",
      techStack: ["MongoDB", "React", "Node"],
      color: "purple"
    }
  ];

  return (
    <>
      <Navbar />
      <div className="min-h-screen bg-white py-16">
        <div className="container mx-auto px-4">
          <h1 className="text-4xl font-bold text-gray-800 mb-12 px-4">
            Your Interviews
          </h1>

          <div className="grid md:grid-cols-2 gap-8 max-w-6xl mx-auto">
            {interviews.map((interview, index) => (
              <InterviewCard
                key={index}
                title={interview.title}
                description={interview.description}
                techStack={interview.techStack}
                color={interview.color}
              />
            ))}
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default InterviewPage; 