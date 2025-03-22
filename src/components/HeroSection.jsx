import React from "react";
import heroSectionImg from '../assets/herosectionimage.jpg'

const HeroSection = () => {
  return (
    <section className="relative sm:h-[38pc] md:h-[25pc] lg:h-[40pc] flex"   //bg-cover bg-no-repeat
      style={{ backgroundImage: "" }}
    >
      <div className="container mx-auto px-6 lg:gap-20 flex flex-col md:flex-row justify-center  items-center">
        
        {/*image for md and sm screen*/}
      <div className=" lg:hidden md:hidden">
          <img className="" src={heroSectionImg} alt=""/>
        </div>

        {/* Left Side - Text Content */}
        <div className="text-white max-w-lg p-5">
          <h1 className="text-xl md:text-3xl lg:text-5xl font-bold leading-tight">
            Build Your <br /> AI-Powered Resume
          </h1>
          <p className="mt-4 sm:text-[20px] md:text-[20px] lg:text-xl opacity-80">
            Optimize your LinkedIn and Resume with AI to land your dream job.
          </p>
          <button className="mt-6 px-6 py-3 font-bold hover:font-extrabold  bg-amber-500 rounded-3xl transition">
            Get Started
          </button>
        </div>

        <div className="w-full hidden md:block lg:w-3xl">
          <img className="" src={heroSectionImg} alt=""/>
        </div>
        
      </div>
    </section>
  );
};

export default HeroSection;
