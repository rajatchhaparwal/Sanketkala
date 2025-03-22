import React from 'react'
import Navbar from '../components/Navbar';
import HeroSection from '../components/HeroSection';
import Feutures  from '../components/Feutures';

export default function Home() {
  return (
    <div className="bg-neutral-800">
      <Navbar/>
      <HeroSection/>
      <Feutures/>
    </div>
  )
}
