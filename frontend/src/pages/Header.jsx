import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { IoIosNotificationsOutline } from "react-icons/io";
import { BiFullscreen } from "react-icons/bi"; // Import the fullscreen icon
import { HiMenu } from "react-icons/hi"; // Import the hamburger menu icon
import { LuMonitorCheck } from "react-icons/lu"; // Import the LuMonitorCheck icon

const Header = () => {
  const [isUserDropdownOpen, setIsUserDropdownOpen] = useState(false);
  const [isNotificationDropdownOpen, setIsNotificationDropdownOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false); // State for mobile menu
  const [isMobileView, setIsMobileView] = useState(window.innerWidth <= 761); // State for mobile view

  const userDropdownRef = useRef(null);
  const notificationDropdownRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const toggleUserDropdown = () => {
    setIsUserDropdownOpen(!isUserDropdownOpen);
    setIsNotificationDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleNotificationDropdown = () => {
    setIsNotificationDropdownOpen(!isNotificationDropdownOpen);
    setIsUserDropdownOpen(false);
    setIsMobileMenuOpen(false);
  };

  const toggleFullscreen = () => {
    if (!document.fullscreenElement) {
      document.documentElement.requestFullscreen();
    } else if (document.exitFullscreen) {
      document.exitFullscreen();
    }
  };

  const toggleMobileMenu = () => {
    setIsMobileMenuOpen(!isMobileMenuOpen);
    setIsUserDropdownOpen(false);
    setIsNotificationDropdownOpen(false);
  };

  const handleResize = () => {
    const isMobile = window.innerWidth <= 761;
    setIsMobileView(isMobile);
    if (!isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  const handleClickOutside = (event) => {
    if (
      userDropdownRef.current && !userDropdownRef.current.contains(event.target) &&
      notificationDropdownRef.current && !notificationDropdownRef.current.contains(event.target) &&
      mobileMenuRef.current && !mobileMenuRef.current.contains(event.target)
    ) {
      setIsUserDropdownOpen(false);
      setIsNotificationDropdownOpen(false);
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      window.removeEventListener("resize", handleResize);
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  return (
    <>
      <nav className="bg-white border-gray-200 dark:bg-gray-900 relative">
        <div className="flex flex-wrap justify-between items-center mx-auto max-w-screen-lg py-0 p-2">
          <Link
            to="https://flowbite.com"
            className="flex items-center space-x-3 rtl:space-x-reverse"
          >
            <img
              src="https://flowbite.com/docs/images/logo.svg"
              className="h-8"
              alt="Flowbite Logo"
            />
            <span className="self-center text-2xl font-semibold whitespace-nowrap dark:text-white">
              Flowbite
            </span>
          </Link>
          <div className="flex items-center space-x-3 rtl:space-x-reverse">
            {isMobileView && (
              <button
                className="text-gray-900 dark:text-white"
                onClick={toggleMobileMenu}
              >
                <HiMenu className="w-6 h-6" />
              </button>
            )}
            <div className="ms-1 header-item hidden sm:flex border p-2 rounded-full hover:bg-gray-100">
              <button
                type="button"
                className="btn btn-icon btn-topbar btn-ghost-secondary rounded-full"
                onClick={toggleFullscreen}
              >
                <BiFullscreen className="w-6 h-6" />
              </button>
            </div>
            <div className="relative dropdown topbar-head-dropdown ms-1 header-item" ref={notificationDropdownRef}>
              <button
                type="button"
                className="relative inline-flex items-center border p-2 rounded-full text-sm font-medium text-center text-gray-500 hover:text-gray-900 hover:bg-gray-200 focus:outline-none dark:hover:text-white dark:text-gray-400 btn btn-icon btn-topbar btn-ghost-secondary"
                id="page-header-notifications-dropdown"
                aria-haspopup="true"
                aria-expanded={isNotificationDropdownOpen}
                onClick={toggleNotificationDropdown}
              >
                <IoIosNotificationsOutline className="w-5 h-5" aria-hidden="true" />
                <div className="absolute flex items-center justify-center w-4 h-4 text-xs font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -right-1 dark:border-gray-900">
                  3
                </div>
              </button>

              {isNotificationDropdownOpen && (
                <div className="absolute right-0 mt-2 w-80 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50">
                  jjddqwdkwqdk
                </div>
              )}
            </div>

            <div className="relative dropdown ms-sm-3 header-item topbar-user p-2 bg-gray-200" ref={userDropdownRef}>
              <button
                type="button"
                className="btn"
                id="page-header-user-dropdown"
                aria-haspopup="true"
                aria-expanded={isUserDropdownOpen}
                onClick={toggleUserDropdown}
              >
                <span className="flex items-center">
                  <img
                    className="rounded-full h-8 w-8"
                    src="https://via.placeholder.com/150"
                    alt="Header Avatar"
                  />
                  <span className="text-start ms-xl-2">
                    <span className="hidden xl:inline-block ms-1 font-medium user-name-text">
                      Anna Adame
                    </span>
                    <span className="hidden xl:block ms-1 text-xs user-name-sub-text">
                      Founder
                    </span>
                  </span>
                </span>
              </button>
              {isUserDropdownOpen && (
                <div className="absolute right-0 mt-2 w-48 bg-white dark:bg-gray-800 rounded-md shadow-lg z-50">
                  <div className="py-2">
                    <h6 className="px-4 py-2 text-gray-900 dark:text-white">
                      Welcome Anna!
                    </h6>
                    <Link
                      to="pages-profile.html"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <i className="mdi mdi-account-circle text-muted fs-16 align-middle me-1"></i>{" "}
                      Profile
                    </Link>
                    <Link
                      to="apps-chat.html"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <i className="mdi mdi-message-text-outline text-muted fs-16 align-middle me-1"></i>{" "}
                      Messages
                    </Link>

                    <div className="border-t border-gray-200 dark:border-gray-700"></div>

                    <Link
                      to="pages-profile-settings.html"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <span className="badge bg-success-subtle text-success mt-1 float-end">
                        New
                      </span>
                      <i className="mdi mdi-cog-outline text-muted fs-16 align-middle me-1"></i>{" "}
                      Settings
                    </Link>
                    <Link
                      to="auth-lockscreen-basic.html"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <i className="mdi mdi-lock text-muted fs-16 align-middle me-1"></i>{" "}
                      Lock screen
                    </Link>
                    <Link
                      to="auth-logout-basic.html"
                      className="block px-4 py-2 text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-700"
                    >
                      <i className="mdi mdi-logout text-muted fs-16 align-middle me-1"></i>{" "}
                      Logout
                    </Link>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
        {isMobileMenuOpen && (
          <div className="absolute top-full left-0 w-full bg-white dark:bg-gray-900 shadow-lg z-50 transition-transform transform duration-300 ease-in-out" ref={mobileMenuRef}>
            <ul className="flex flex-col font-medium mt-0 space-y-4 text-sm p-4">
              <li>
                <Link
                  to="#"
                  className="text-gray-900 dark:text-white hover:underline"
                  aria-current="page"
                  onClick={toggleMobileMenu}
                >
                  Pool Scrubbing
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-900 dark:text-white hover:underline"
                  onClick={toggleMobileMenu}
                >
                  Payout Monitoring
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-900 dark:text-white hover:underline"
                  onClick={toggleMobileMenu}
                >
                  Loss Estimation
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-900 dark:text-white hover:underline"
                  onClick={toggleMobileMenu}
                >
                  Payout Verification
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-900 dark:text-white hover:underline"
                  onClick={toggleMobileMenu}
                >
                  DA Management
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-900 dark:text-white hover:underline"
                  onClick={toggleMobileMenu}
                >
                  Co Lending Management 
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="text-gray-900 dark:text-white hover:underline"
                  onClick={toggleMobileMenu}
                >
                  PTC Management
                </Link>
              </li>
            </ul>
          </div>
        )}
      </nav>
      <nav className={`bg-gray-50 dark:bg-gray-700 border-t-2 flex ${isMobileView ? 'hidden' : ''}`}>
        <div className="max-w-screen-xl px-4 py-3 m-auto w-full">
          <div className="flex items-center justify-center">
            <ul className="flex-col sm:flex-row font-medium mt-0 space-y-4 sm:space-y-0 sm:space-x-8 rtl:space-x-reverse text-sm hidden sm:flex">
              <li>
                <Link
                  to="#"
                  className="flex items-center gap-1 rounded-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LuMonitorCheck className="w-4 h-4" />
                  <span className="text-xs">Pool Scrubbing</span>
                </Link>
              </li>
              <li>
                <Link
                  to="/pool-monitoring"
                  className="flex items-center gap-1 rounded-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LuMonitorCheck className="w-4 h-4" />
                  <span className="text-xs">Pool Monitoring</span>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="flex items-center gap-1 rounded-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LuMonitorCheck className="w-4 h-4" />
                  <span className="text-xs">Loss Estimation</span>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="flex items-center gap-1 rounded-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LuMonitorCheck className="w-4 h-4" />
                  <span className="text-xs">Payout Verification</span>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="flex items-center gap-1 rounded-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LuMonitorCheck className="w-4 h-4" />
                  <span className="text-xs">DA Management</span>
                </Link>
              </li>
              <li>
                <Link
                  to=""
                  className="flex items-center gap-1 rounded-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LuMonitorCheck className="w-4 h-4" />
                  <span className="text-xs">Co Lending Management</span>
                </Link>
              </li>
              <li>
                <Link
                  to="#"
                  className="flex items-center gap-1 rounded-md text-gray-900 dark:text-white hover:bg-gray-100 dark:hover:bg-gray-700"
                >
                  <LuMonitorCheck className="w-4 h-4" />
                  <span className="text-xs">PTC Management</span>
                </Link>
              </li>
            </ul>
          </div>
        </div>
      </nav>
    </>
  );
};

export default Header;
