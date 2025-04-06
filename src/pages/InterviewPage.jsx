import React from 'react';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import AIInterview from '../Interview/AIInterview';

const InterviewPage = () => {
  return (
    <div className="min-h-screen flex flex-col">
      <Navbar />
      <div className="flex-grow">
        <AIInterview />
      </div>
      <Footer />
    </div>
  );
};

export default InterviewPage;
