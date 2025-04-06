import { useState } from "react";
import {Link, Outlet, useNavigate} from "react-router-dom";
import { Menu, X } from "lucide-react";

import useAuthUser from "../Auth/useAuthUser.js";

export default function Navbar() {
  const [isOpen, setIsOpen] = useState(false);
  
 const user = useAuthUser();
 const navigate = useNavigate();

  return (
    <nav className="p-4 bg-neutral-800 ">
      <div className="container  text-white mx-auto flex justify-between items-center">
        
        {/* Logo */}
        <div className="text-2xl font-bold">
          <Link to="/">
          Sanketkala<span className="text-amber-500">AI</span>
          </Link>
        </div>

        <div className="hidden md:flex space-x-6">
         <Link to="/" className="hover:text-amber-500">Home</Link>
         <Link to="/about" className="hover:text-amber-500">About</Link>
          <Link onClick={() => window.scrollTo({top: 600, behavior:'smooth'})} className="hover:text-amber-500">Features</Link>
          <Link onClick={() => window.scrollTo({top:1000,behavior:'smooth'})} className="hover:text-amber-500">How it Works</Link>
        </div>

        <div className="flex items-center space-x-4">

         { user? (<Link className="hidden" >Sign In</Link>): (<Link to={"/signIn"} className="hover:text-amber-600 hidden sm:block" >Sign In</Link>)}

         {user ? (
  <Link to="/getStarted" className="border border-amber-500 hover:font-bold px-4 py-2 rounded-3xl">
    Get Started
  </Link>
) : (
  <Link to="/signIn"  className="border border-amber-500 hover:font-bold px-4 py-2 rounded-3xl"> Get Started</Link>
)}

          {/* Mobile Menu Button */}
          <button className="md:hidden" onClick={() => setIsOpen(!isOpen)}>
            {isOpen ? <X size={24} /> : <Menu size={24} />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="md:hidden mt-4 space-y-2 text-white">
          <Link to={"/signIn"} className="block text-center p-2 hover:bg-gray-200 hover:text-gray-800">Sign In</Link>
          <Link to={'/'} className="block text-center p-2 hover:bg-gray-200 hover:text-gray-800">Home</Link>
          <Link to={'/about'} className="block text-center p-2 hover:bg-gray-200 hover:text-gray-800">About</Link>
        </div>
      )}
      <Outlet/>
    </nav>
  );
}
