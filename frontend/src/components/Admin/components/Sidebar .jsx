import React, { useState } from "react";
import { Link } from "react-router-dom";
import {
  FaHome,
  FaUsers,
  FaBell,
  FaFileAlt,
  FaCog,
  FaChevronRight,
} from "react-icons/fa";

const Sidebar = ({ isCollapsed, toggleSidebar, isMobile }) => {
  const [openMenu, setOpenMenu] = useState(null);

  const handleMenuClick = (menuName) => {
    setOpenMenu(openMenu === menuName ? null : menuName);
  };

  const MenuItem = ({ to, label, icon: Icon, children }) => {
    const hasSubmenu = !!children;

    return (
      <li>
        {hasSubmenu ? (
          <>
            <button
              onClick={() => handleMenuClick(label)}
              className="flex items-center p-3 text-gray-900 rounded-lg hover:bg-gradient-to-r from-orange-100 to-yellow-100 w-full text-left transition-colors duration-300"
            >
              {Icon && <Icon className="text-orange-500 dark:text-yellow-400" />}
              <span
                className={`ml-3 ${!isCollapsed ? "block" : "hidden"} ${
                  Icon ? "ml-2" : ""
                }`}
              >
                {label}
              </span>
              <FaChevronRight
                className={`ml-auto w-4 h-4 text-gray-600 transition-transform ${
                  openMenu === label ? "rotate-90" : ""
                }`}
              />
            </button>
            {openMenu === label && !isCollapsed && (
              <ul className="ml-4 mt-2 space-y-2 bg-gray-50 rounded-lg shadow-lg">
                {children}
              </ul>
            )}
          </>
        ) : (
          <Link
            to={to}
            onClick={() => {
              if (isMobile) toggleSidebar();
            }}
            className="flex items-center p-3 text-gray-900 rounded-lg hover:bg-gradient-to-r from-orange-100 to-yellow-100 transition-colors duration-300"
          >
            {Icon && <Icon className="text-orange-500 dark:text-yellow-400" />}
            <span
              className={`ml-3 ${!isCollapsed ? "block" : "hidden"} ${
                Icon ? "ml-2" : ""
              }`}
            >
              {label}
            </span>
          </Link>
        )}
      </li>
    );
  };

  const SubMenuItem = ({ to, label }) => (
    <li>
      <Link
        to={to}
        onClick={() => {
          if (isMobile) toggleSidebar(); // Close sidebar in mobile view
        }}
        className="flex items-center p-2 text-gray-700 rounded-lg hover:bg-orange-200 transition-colors duration-300"
      >
        <span className="ml-3">{label}</span>
      </Link>
    </li>
  );

  return (
    <div
      className={`fixed top-1 left-0 h-screen transition-transform transform ${
        isCollapsed ? "-translate-x-full" : "translate-x-0"
      } bg-white z-40 w-64 shadow-lg`}
      aria-label="Sidebar"
    >
      <div className="overflow-y-auto h-full px-4 py-6 border-r border-gray-200">
        <nav>
          <ul className="space-y-2 mt-10">
            <MenuItem to="/admin/home" label="Home" icon={FaHome} />
            <MenuItem label="Users" to="/admin/user-list" icon={FaUsers} />
            <MenuItem label="Circular" icon={FaFileAlt}>
              <SubMenuItem to="/admin/circular-upload" label="Add Circular" />
              <SubMenuItem to="/admin/edit-circular" label="Edit Circular" />
            </MenuItem>
            <MenuItem label="Notification" icon={FaBell}>
              <SubMenuItem
                to="/admin/send-notification"
                label="Add Notification"
              />
              <SubMenuItem
                to="/admin/edit-notification"
                label="Edit Notification"
              />
            </MenuItem>
            <MenuItem to="/admin/feed" label="Feed" icon={FaFileAlt} />
            <MenuItem label="Settings" icon={FaCog}>
              <SubMenuItem to="/user-settings" label="User Settings" />
              <SubMenuItem to="/app-settings" label="App Settings" />
            </MenuItem>
          </ul>
        </nav>
      </div>
    </div>
  );
};

export default Sidebar;
