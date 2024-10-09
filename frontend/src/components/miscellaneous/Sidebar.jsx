import React from "react";
import { Link } from "react-router-dom";

const Sidebar = ({ isOpen, toggleSidebar }) => {
  return (
    <div
      className={`fixed inset-y-0 left-0 w-64 bg-white shadow-lg transform ${
        isOpen ? "translate-x-0" : "-translate-x-full"
      } transition-transform duration-300 ease-in-out md:translate-x-0`}
    >
      <div className="flex items-center justify-center h-16 bg-orange-500">
        <h1 className="text-2xl font-bold text-white">Logo</h1>
      </div>
      <nav className="mt-10">
        <Link
          to="/pool-monitoring"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-orange-500 hover:text-white"
        >
          Pool Monitoring
        </Link>
        <a
          href="#"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-orange-500 hover:text-white"
        >
          Dashboard
        </a>
        <a
          href="#"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-orange-500 hover:text-white"
        >
          Profile
        </a>
        <a
          href="#"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-orange-500 hover:text-white"
        >
          Settings
        </a>
        <a
          href="#"
          className="block py-2.5 px-4 rounded transition duration-200 hover:bg-orange-500 hover:text-white"
        >
          Logout
        </a>
      </nav>
    </div>
  );
};

export default Sidebar;
