import React, { useState } from "react";
import png1 from "../../assets/poolguru-logo-grey.png";
import { Link, NavLink } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faSignIn, faUserPlus } from "@fortawesome/free-solid-svg-icons";

function NavL() {
  const [isOpen, setIsOpen] = useState(false);
  const token = localStorage.getItem("token");

  const toggleMenu = () => setIsOpen(!isOpen);
  const closeMenu = () => setIsOpen(false);

  return (
    <header className="sticky top-0 left-0 right-0 z-40 flex items-center justify-between px-6 mt-0 bg-white text-black shadow-md">
      <div className="flex items-center py-2">
        <Link to="/" onClick={closeMenu}>
          <img src={png1} alt="Logo" className="ms-3 w-14 " />
        </Link>
      </div>

      <div className="flex items-center lg:hidden gap-3 ml-auto">
        <Link to="/login" onClick={closeMenu}>
          <FontAwesomeIcon
            icon={faSignIn}
            className="h-6 w-6 text-black hover:text-orange-500"
          />
        </Link>
        <Link to="/signup" onClick={closeMenu}>
          <FontAwesomeIcon
            icon={faUserPlus}
            className="h-6 w-6 text-black hover:text-orange-500"
          />
        </Link>
        {/* Hamburger menu button */}
        <button
          className="z-10 lg:hidden p-2 transition-transform transform hover:scale-110 hover:bg-gray-100"
          onClick={toggleMenu}
          aria-label="Toggle menu"
        >
          <svg
            className="h-6 w-6 text-gray-800 transition-colors duration-300 hover:text-orange-500"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            xmlns="http://www.w3.org/2000/svg"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth={2}
              d="M4 6h16M4 12h16M4 18h16"
            />
          </svg>
        </button>
      </div>

      {/* Navigation menu */}
      <nav
        className={`${
          isOpen ? "max-h-screen opacity-100" : "max-h-0 opacity-0"
        } absolute left-0 right-0 top-16 overflow-hidden transition-all duration-300 ease-in-out lg:block bg-white lg:bg-transparent lg:relative lg:top-0 lg:max-h-full lg:opacity-100`}
      >
        <ul className="flex flex-col space-y-4 p-4 lg:flex-row lg:space-x-6 lg:space-y-0 lg:p-0 lg:justify-between">
          <li>
            <NavLink
              to="/"
              end
              className={({ isActive }) =>
                `inline-block px-2 py-1 ${
                  isActive ? "text-orange-500" : "text-gray-700"
                } hover:text-orange-500 transition-transform transform hover:scale-125 duration-300 ease-in-out`
              }
              onClick={closeMenu}
            >
              Home
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/services"
              className={({ isActive }) =>
                `inline-block px-2 py-1 ${
                  isActive ? "text-orange-500" : "text-gray-700"
                } hover:text-orange-500 transition-transform transform hover:scale-125 duration-300 ease-in-out`
              }
              onClick={closeMenu}
            >
              Services
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/aboutus"
              className={({ isActive }) =>
                `inline-block px-2 py-1 ${
                  isActive ? "text-orange-500" : "text-gray-700"
                } hover:text-orange-500 transition-transform transform hover:scale-125 duration-300 ease-in-out`
              }
              onClick={closeMenu}
            >
              About Us
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/teams"
              className={({ isActive }) =>
                `inline-block px-2 py-1 ${
                  isActive ? "text-orange-500" : "text-gray-700"
                } hover:text-orange-500 transition-transform transform hover:scale-125 duration-300 ease-in-out`
              }
              onClick={closeMenu}
            >
              Our Teams
            </NavLink>
          </li>
          <li>
            <NavLink
              to="/contactus"
              className={({ isActive }) =>
                `inline-block px-2 py-1 ${
                  isActive ? "text-orange-500" : "text-gray-700"
                } hover:text-orange-500 transition-transform transform hover:scale-125 duration-300 ease-in-out`
              }
              onClick={closeMenu}
            >
              Contact Us
            </NavLink>
          </li>
        </ul>
      </nav>
      {!token ? (
        <div className="hidden lg:flex items-center gap-2 lg:gap-4">
          {/* Sign Up and Login buttons */}
          <Link to="/signup" onClick={closeMenu}>
            <button className="flex items-center justify-center text-white bg-gradient-to-r from-orange-500 to-yellow-500 border-2 rounded-lg px-4 py-2 font-medium text-base dark:text-orange-400 dark:hover:text-orange-500  duration-300 cursor-pointer transition-transform transform hover:scale-105">
              <i className="mdi mdi-account-plus mr-2"></i>Sign Up
            </button>
          </Link>
          <Link to="/login" onClick={closeMenu}>
            <button 
            className="flex items-center justify-center text-orange-400 hover:text-white hover:bg-gradient-to-r from-orange-500 to-yellow-500 border-2 rounded-lg px-4 py-2 font-medium text-base dark:text-orange-400 dark:hover:text-orange-500  duration-300 cursor-pointer transition-transform transform hover:scale-105">
              <i className="mdi mdi-login mr-2"></i>Sign In
            </button>
          </Link>
        </div>
      ) : (
        <Link to="/home" onClick={closeMenu}>
          <button className="flex items-center justify-center text-white bg-gradient-to-r from-orange-500 to-yellow-500 border-2 rounded-lg px-4 py-2 font-medium text-base dark:text-orange-400 dark:hover:text-orange-500  duration-300 cursor-pointer transition-transform transform hover:scale-105">
            <i className="mdi mdi-explore mr-2"></i>Explore
          </button>
        </Link>
      )}
    </header>
  );
}

export default NavL;
