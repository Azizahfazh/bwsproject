import React from "react";
import { FaFacebook, FaInstagram, FaTwitter } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="py-8 mt-10 text-white bg-pink-500">
      <div className="flex flex-col items-center justify-between px-4 mx-auto space-y-4 max-w-7xl md:flex-row md:space-y-0">
        {/* Branding */}
        <div className="text-center md:text-left">
          <h2 className="text-2xl font-bold">HYNailArt</h2>
          <p className="mt-1 text-sm">&copy; {new Date().getFullYear()} All rights reserved.</p>
        </div>

        {/* Quick Links */}
        <div className="flex space-x-6">
          <a href="#" className="hover:text-gray-200">Home</a>
          <a href="#" className="hover:text-gray-200">About</a>
          <a href="#" className="hover:text-gray-200">Booking</a>
        </div>

        {/* Social Media */}
        <div className="flex space-x-4">
          <a href="#" className="hover:text-gray-200"><FaFacebook size={20} /></a>
          <a href="#" className="hover:text-gray-200"><FaInstagram size={20} /></a>
          <a href="#" className="hover:text-gray-200"><FaTwitter size={20} /></a>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
