import React, { useState, useRef, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useSelector } from "react-redux";
import pn1 from "../../../assets/poolguru-logo-grey.png";
import { useDispatch } from "react-redux";
import { clearUser } from "../../../Redux/userslice";
import { BsLayoutSidebarInset } from "react-icons/bs";

function AdminNavbar({ toggleSidebar }) {
  const [isDropdownOpen, setIsDropdownOpen] = useState(false);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 1048);
  const dropdownRef = useRef(null);
  const navigate = useNavigate();
  const user = useSelector((state) => state.user);
  const dispatch = useDispatch();

  const handleLogout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    toast.success("Logged out successfully", {
      position: "top-center",
    });
    setTimeout(() => {
      navigate("/");
      dispatch(clearUser());
    }, 1000);
  };

  const toggleDropdown = () => setIsDropdownOpen(!isDropdownOpen);

  useEffect(() => {
    const handleResize = () => {
      setIsMobileView(window.innerWidth <= 1048); // Adjusted to 1048px
    };

    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setIsDropdownOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <div className="fixed top-0 left-0 w-full bg-white text-black flex items-center justify-between px-4 py-2 shadow-md z-50">
      <div className="flex items-center space-x-4">
        <div className="flex items-center">
          <Link to="/">
            <img src={pn1} alt="Logo" className="w-14 m-auto" />
          </Link>
        </div>
      </div>

      <nav className="flex items-center">
        <ul className="flex items-center ">
          <li className="relative" ref={dropdownRef}>
            <button
              className="flex items-center border-2 rounded-full"
              onClick={toggleDropdown}
            >
              <img
                alt="User settings"
                src={user.profilephoto}
                className="w-9 h-9 rounded-full"
              />
            </button>

            {isDropdownOpen && (
              <div className="absolute right-0 mt-2 w-48 bg-white text-black border border-gray-300 rounded shadow-lg">
                <div className="p-4">
                  <span className="block text-sm">
                    {user.firstname} {user.lastname}
                  </span>
                  <span className="block truncate text-sm font-medium">
                    {user.email}
                  </span>
                </div>
                <Link
                  to="/profile"
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Profile
                </Link>
                <Link
                  to="/lockscreen"
                  onClick={() => {
                    localStorage.setItem("isLocked", "true");
                    sessionStorage.setItem(
                      "previousPage",
                      window.location.pathname
                    );
                  }}
                  className="block px-4 py-2 hover:bg-gray-100"
                >
                  Lockscreen
                </Link>

                <hr className="border-t border-gray-300" />
                <Link
                  to="/"
                  onClick={handleLogout}
                  className="block px-4 py-2 text-red-600 hover:bg-gray-100 cursor-pointer"
                >
                  Log out
                </Link>
              </div>
            )}
          </li>
          <li className="m-auto">
            {/* Hamburger Menu Button - Only show if isMobileView is true */}
            {isMobileView && (
              <button
                onClick={toggleSidebar}
                className="text-gray-900 focus:outline-none ms-3 p-2"
              >
                <BsLayoutSidebarInset className="h-6 w-6 text-gray-900  transition-colors duration-300 hover:text-orange-500" />
              </button>
            )}
          </li>
        </ul>
      </nav>
    </div>
  );
}

export default AdminNavbar;
