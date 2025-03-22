import React from "react";

const HeroSection = () => {
  return (
    <section className="relative sm:h-[20pc] md:h-[25pc] lg:h-[40pc] flex items-center justify-center  "   //bg-cover bg-no-repeat
      style={{ backgroundImage: "" }}
    >
      <div className="container mx-auto px-6 flex flex-col md:flex-row items-center">
        
        {/* Left Side - Text Content */}
        <div className="text-white max-w-lg">
          <h1 className="text-5xl font-bold leading-tight">
            Build Your <br /> AI-Powered Resume
          </h1>
          <p className="mt-4 text-lg opacity-80">
            Optimize your LinkedIn and Resume with AI to land your dream job.
          </p>
          <button className="mt-6 px-6 py-3 font-bold hover:font-extrabold  bg-amber-500 rounded-3xl transition">
            Get Started
          </button>
        </div>

        {/* Right Side - Placeholder for Glowing AI Element */}
        <div className="hidden md:block w-1/2"></div>
        
      </div>
    </section>
  );
};

export default HeroSection;
