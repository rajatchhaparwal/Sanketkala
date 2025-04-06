import React from 'react'
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Feutures  from '../components/Feutures';
import HowItWorks from '../components/HowitWorks';
import Testimonials from '../components/Testimonials'
import Footer from '../components/Footer';
import About from './About';

export default function Home() {
  return (
    <div className="bg-neutral-800">
      <Navbar/>
      <HeroSection/>
      <Feutures/>
      <HowItWorks/>
      <Testimonials/>
      <Footer/>
    </div>
  )
}
