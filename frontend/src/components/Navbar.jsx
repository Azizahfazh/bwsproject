import React, { useState } from "react";
import { FaUserCircle, FaHandSparkles } from "react-icons/fa";
import { MdLogin } from "react-icons/md";
import { AiOutlineMenu, AiOutlineClose } from "react-icons/ai";
import { useNavigate, useLocation } from "react-router-dom";

const Navbar = ({ user }) => {
  const [isOpen, setIsOpen] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();

  const toggleMenu = () => setIsOpen(!isOpen);

  const menuItems = [
    { name: "Home", path: "/" },
    { name: "About", path: "/about" },
    { name: "Katalog", path: "/katalog" },
    { name: "My Bookings", path: "/mybookings" },
  ];

  return (
    <nav className="fixed z-50 w-full bg-pink-500 shadow-lg">
      <div className="flex items-center justify-between h-16 px-4 mx-auto max-w-7xl sm:px-6 lg:px-8">
        {/* Logo */}
        <div
          className="flex items-center transition-transform duration-300 cursor-pointer hover:scale-105"
          onClick={() => navigate("/")}
        >
          <FaHandSparkles size={28} className="text-white" />
          <span className="ml-2 text-2xl font-extrabold text-white">HYNailArt</span>
        </div>

        {/* Desktop Menu */}
        <div className="items-center hidden space-x-6 md:flex">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => navigate(item.path)}
              className={`px-3 py-2 rounded-md font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-white text-pink-500"
                  : "text-white hover:text-pink-500 hover:bg-white/20"
              }`}
            >
              {item.name}
            </button>
          ))}

          {user ? (
            <div className="flex items-center px-3 py-2 space-x-2 transition-all duration-200 rounded-md bg-white/20 hover:bg-white/30">
              <FaUserCircle size={24} className="text-white" />
              <span className="font-medium text-white">{user.name}</span>
            </div>
          ) : (
            <button
              onClick={() => navigate("/login")}
              className="flex items-center px-3 py-2 text-white transition-all duration-200 rounded-md hover:text-pink-500 hover:bg-white/20"
            >
              <MdLogin size={24} className="mr-1" />
              Login
            </button>
          )}
        </div>

        {/* Mobile Menu Button */}
        <div className="flex items-center md:hidden">
          <button onClick={toggleMenu} className="p-2 transition-colors rounded-md hover:bg-white/20">
            {isOpen ? <AiOutlineClose size={24} className="text-white" /> : <AiOutlineMenu size={24} className="text-white" />}
          </button>
        </div>
      </div>

      {/* Mobile Menu */}
      <div
        className={`md:hidden bg-pink-500 shadow-lg transition-max-height duration-300 overflow-hidden ${
          isOpen ? "max-h-screen" : "max-h-0"
        }`}
      >
        <div className="px-4 pt-2 pb-3 space-y-1">
          {menuItems.map((item) => (
            <button
              key={item.name}
              onClick={() => {
                navigate(item.path);
                setIsOpen(false);
              }}
              className={`block w-full text-left px-3 py-2 rounded-md font-medium transition-all duration-200 ${
                location.pathname === item.path
                  ? "bg-white text-pink-500"
                  : "text-white hover:text-pink-500 hover:bg-white/20"
              }`}
            >
              {item.name}
            </button>
          ))}

          {user ? (
            <div className="flex items-center px-3 py-2 space-x-2 transition-all duration-200 rounded-md bg-white/20 hover:bg-white/30">
              <FaUserCircle size={24} className="text-white" />
              <span className="font-medium text-white">{user.name}</span>
            </div>
          ) : (
            <button
              onClick={() => {
                navigate("/login");
                setIsOpen(false);
              }}
              className="flex items-center w-full px-3 py-2 text-left text-white transition-all duration-200 rounded-md hover:text-pink-500 hover:bg-white/20"
            >
              <MdLogin size={24} className="mr-1" />
              Login
            </button>
          )}
        </div>
      </div>
    </nav>
  );
};

export default Navbar;
