import React from 'react';
import { useNavigate } from 'react-router-dom';

const InterviewCard = ({ title, description, techStack, color }) => {
  const navigate = useNavigate();

  const getCompanyIcon = (title) => {
    if (title.includes("Full Stack")) {
      return "https://upload.wikimedia.org/wikipedia/commons/4/4a/Amazon_icon.svg";
    } else if (title.includes("Front End")) {
      return "https://upload.wikimedia.org/wikipedia/commons/c/c1/Hashnode_icon.svg";
    } else if (title.includes("Backend")) {
      return "https://www.svgrepo.com/show/331552/microsoft.svg";
    } else {
      return "https://www.svgrepo.com/show/448234/google.svg";
    }
  };

  const getTechIcon = (tech) => {
    const icons = {
      HTML5: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/html5/html5-original.svg",
      CSS3: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/css3/css3-original.svg",
      JavaScript: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/javascript/javascript-original.svg",
      React: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/react/react-original.svg",
      Node: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/nodejs/nodejs-original.svg",
      MongoDB: "https://cdn.jsdelivr.net/gh/devicons/devicon/icons/mongodb/mongodb-original.svg"
    };
    return icons[tech] || icons.JavaScript;
  };

  const getBackgroundColor = () => {
    const colors = {
      orange: "bg-orange-500",
      blue: "bg-blue-500",
      green: "bg-green-500",
      purple: "bg-purple-500"
    };
    return colors[color] || "bg-gray-500";
  };

  const handleStartInterview = () => {
    const interviewPath = title.toLowerCase().replace(/ /g, '-');
    navigate(`/interview/${interviewPath}`, { 
      state: { 
        title,
        techStack 
      }
    });
  };

  return (
    <div className="bg-[#1a1a1a] rounded-xl overflow-hidden transition-transform duration-300 hover:-translate-y-2 shadow-lg">
      <div className={`h-2 ${getBackgroundColor()}`} />
      <div className="p-6">
        <div className="flex items-start justify-between mb-4">
          <img 
            src={getCompanyIcon(title)}
            alt="Company Logo"
            className="w-16 h-16 rounded-full bg-white p-2"
          />
          <div className="px-3 py-1 bg-[#3b3b4d] text-white text-sm rounded-full">
            Mix Between Behavioral And Technical
          </div>
        </div>

        <h3 className="text-2xl font-bold text-white mb-2">{title}</h3>
        <div className="flex items-center gap-2 text-gray-400 mb-4">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M8 7V3m8 4V3m-9 8h10M5 21h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v12a2 2 0 002 2z" />
          </svg>
          <span>Mar 19, 2025</span>
          <span className="ml-2">
            <svg className="w-5 h-5 inline text-yellow-500" fill="currentColor" viewBox="0 0 24 24">
              <path d="M12 17.27L18.18 21l-1.64-7.03L22 9.24l-7.19-.61L12 2 9.19 8.63 2 9.24l5.46 4.73L5.82 21z" />
            </svg>
            ---/100
          </span>
        </div>

        <p className="text-gray-400 mb-6">
          You haven't taken this interview yet. Take it now to improve your skills.
        </p>

        <div className="flex gap-2 mb-6">
          {techStack.slice(0, 3).map((tech, index) => (
            <img 
              key={index}
              src={getTechIcon(tech)}
              alt={tech}
              className="w-8 h-8 bg-white rounded-full p-1"
            />
          ))}
        </div>

        <button
          onClick={handleStartInterview}
          className="w-full py-2 px-4 bg-[#3b3b4d] border border-amber-500 text-white rounded-lg font-semibold hover:bg-[#4a4a5e] transition-colors duration-300"
        >
          View Interview
        </button>
      </div>
    </div>
  );
};

export default InterviewCard; 