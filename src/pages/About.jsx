import React from 'react'
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

function About() {
  return (
    <>
    <Navbar/>
    <div className='justify-self-center w-full text-center text-xl lg:w-6xl m-15'>
      <section className='mt-6'>
    <h2 className='text-xl font-bold'>Our Mission</h2>
    <p className='mt-2'>
      At SanketKala, we believe that every individual deserves the best opportunities in their career. Our goal is to simplify the resume-building process 
      by providing smart, data-driven insights that highlight your strengths and align with industry trends.
    </p>
  </section>

  <section className='mt-6'>
    <h2 className='text-xl font-bold'>What We Offer</h2>
    <ul className='list-disc list-inside mt-2 text-left inline-block'>
      <li><strong>AI-Powered Resume Builder:</strong> Automatically generate professional resumes based on your LinkedIn profile and experience.</li>
      <li><strong>Profile Optimization:</strong> Receive suggestions to improve your LinkedIn presence and make your profile more attractive to recruiters.</li>
      <li><strong>Personalized Insights:</strong> Get tailored recommendations based on industry standards and job market trends.</li>
      <li><strong>Seamless Experience:</strong> Our user-friendly interface ensures a hassle-free process, saving you time and effort.</li>
    </ul>
  </section>

  <section className='mt-6'>
    <h2 className='text-xl font-bold'>Why Choose Us?</h2>
    <ul className='list-disc list-inside mt-2 text-left inline-block'>
      <li><strong>AI-Driven Accuracy:</strong> Our AI algorithms ensure precise recommendations and formatting for your resume.</li>
      <li><strong>Time-Saving:</strong> No more struggling with formatting—get a polished resume in minutes.</li>
      <li><strong>Career Boosting:</strong> Stand out in the job market with a resume that highlights your key skills and achievements.</li>
    </ul>
  </section>

  <section className='mt-6'>
    <h2 className='text-xl font-bold'>Join Us Today!</h2>
    <p className='mt-2'>
      Start your journey towards a better career with SanketKala. Whether you’re a fresher or an experienced professional, 
      our AI-driven tools will help you create a resume that leaves a lasting impression.
    </p>
  </section>
</div>
      <Footer/>
    </>
  )
}

export default About
