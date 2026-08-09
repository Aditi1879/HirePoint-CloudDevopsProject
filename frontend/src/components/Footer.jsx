import React from 'react';
import { FaFacebookF, FaTwitter, FaLinkedinIn } from 'react-icons/fa';

const Footer = () => {
  return (
    <footer className="bg-white text-black py-4 shadow-inner">
      {/* Shadow-line for separation */}
      <div className="w-full h-1 bg-gray-200 shadow-lg"></div>
      
      <div className="container mx-auto flex justify-between items-center px-4">
        {/* Left Section: Logo and Copyright */}
        <div className="text-left space-y-1">
          <h1 className="text-xl font-bold">HirePoint</h1>
          <p className="text-gray-700 text-sm">
            © {new Date().getFullYear()} HirePoint. All Rights Reserved.
          </p>
        </div>
        
        {/* Center Section: Links */}
        <div className="flex space-x-6">
          <a href="/about" className="text-gray-700 hover:text-black transition">
            About Us
          </a>
          <a href="/contact" className="text-gray-700 hover:text-black transition">
            Contact
          </a>
          <a href="/privacy" className="text-gray-700 hover:text-black transition">
            Privacy Policy
          </a>
        </div>
        
        {/* Right Section: Social Media Icons */}
        <div className="flex space-x-4">
          <a
            href="https://facebook.com"
            className="text-gray-700 hover:text-black transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaFacebookF size={20} />
          </a>
          <a
            href="https://twitter.com"
            className="text-gray-700 hover:text-black transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaTwitter size={20} />
          </a>
          <a
            href="https://linkedin.com"
            className="text-gray-700 hover:text-black transition"
            target="_blank"
            rel="noopener noreferrer"
          >
            <FaLinkedinIn size={20} />
          </a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
