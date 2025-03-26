import React from "react";
import { Facebook, Twitter, Linkedin, Mail } from "lucide-react";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10">
      <div className="container mx-auto px-6">
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-8">
          
          {/* Column 1: Brand Info */}
          <div>
            <h2 className="text-2xl font-bold">Sanketkala</h2>
            <p className="mt-2 text-gray-400">Enhance your resume and LinkedIn profile with AI.</p>
          </div>

          {/* Column 2: Useful Links */}
          <div>
            <h3 className="text-xl font-semibold">Quick Links</h3>
            <ul className="mt-2 space-y-2 text-gray-400">
              <li><a href="/features" className="hover:text-white">Features</a></li>
              <li><a href="/pricing" className="hover:text-white">Pricing</a></li>
              <li><a href="/about" className="hover:text-white">About Us</a></li>
              <li><a href="/contact" className="hover:text-white">Contact</a></li>
            </ul>
          </div>

          {/* Column 3: Social Media */}
          <div>
            <h3 className="text-xl font-semibold">Follow Us</h3>
            <div className="mt-2 flex space-x-4">
              <a href="https://facebook.com" className="text-gray-400 hover:text-white"><Facebook size={24} /></a>
              <a href="https://twitter.com" className="text-gray-400 hover:text-white"><Twitter size={24} /></a>
              <a href="https://linkedin.com" className="text-gray-400 hover:text-white"><Linkedin size={24} /></a>
              <a href="mailto:support@yourwebsite.com" className="text-gray-400 hover:text-white"><Mail size={24} /></a>
            </div>
          </div>
        </div>

        {/* Bottom Section */}
        <div className="mt-8 border-t border-gray-700 pt-4 text-center text-gray-500">
          <p>© {new Date().getFullYear()} AI Resume Optimizer. All rights reserved.</p>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
