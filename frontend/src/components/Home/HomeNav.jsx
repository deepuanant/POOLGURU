import React, { useState, useEffect, useRef } from "react";
import png1 from "../../assets/poolguru-logo-grey.png";
import { Link } from "react-router-dom";
import { getNotifications, getcircularofuser } from "../../api/userapi";
import { useSelector } from "react-redux";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { HiMenu } from "react-icons/hi";
import { IoIosNotificationsOutline } from "react-icons/io";
import { BiFullscreen } from "react-icons/bi";
import { LuMonitorCheck } from "react-icons/lu";
import { AiOutlineReconciliation } from "react-icons/ai";
import { FaTasks } from "react-icons/fa";
import { RiSecurePaymentLine } from "react-icons/ri";
import { FaCoins } from "react-icons/fa";
import { BsGraphDownArrow } from "react-icons/bs";
import { GiPoolTriangle } from "react-icons/gi";
import Notification from "./Alertmodal";

function HomeNav() {
  const [isDropdownOpen, setDropdownOpen] = useState(false);
  const [isNotificationOpen, setNotificationOpen] = useState(false);
  const [totalunread, setTotalunread] = useState(0);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [unreadNot, setUnreadNot] = useState(0);
  const [unreadCir, setUnreadCir] = useState(0);
  const [isMobileView, setIsMobileView] = useState(window.innerWidth < 1024);

  const user = useSelector((state) => state.user);
  const navigate = useNavigate();

  const dropdownRef = useRef(null);
  const notificationRef = useRef(null);
  const mobileMenuRef = useRef(null);

  const toggleDropdown = () => setDropdownOpen(!isDropdownOpen);

  const toggleNotification = async () => {
    setNotificationOpen(!isNotificationOpen);
    if (totalunread > 0) {
      setTotalunread(0);
    }
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
    setDropdownOpen(false);
    setNotificationOpen(false);
  };

  const closeMobileMenu = () => {
    setIsMobileMenuOpen(false);
  };

  const handleResize = () => {
    const isMobile = window.innerWidth < 1024;
    setIsMobileView(isMobile);
    if (!isMobile) {
      setIsMobileMenuOpen(false);
    }
  };

  useEffect(() => {
    window.addEventListener("resize", handleResize);
    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, []);

  useEffect(() => {
    const fetchNotifications = async () => {
      try {
        const response = await getNotifications();
        if (response.status === 200) {
          const data = response.data.result.reverse();
          const unreadCount = data.filter(
            (notification) => !notification.read
          ).length;
          setUnreadNot(unreadCount);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchCirculars = async () => {
      try {
        const response = await getcircularofuser();
        if (response.status === 200) {
          const data = response.data.result.reverse();
          const unreadCount = data.filter((circular) => !circular.read).length;
          setUnreadCir(unreadCount);
        }
      } catch (error) {
        console.log(error);
      }
    };

    const fetchData = async () => {
      await fetchCirculars();
      await fetchNotifications();
    };

    fetchData();
  }, []);

  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setDropdownOpen(false);
      }
      if (
        notificationRef.current &&
        !notificationRef.current.contains(event.target)
      ) {
        setNotificationOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const updatecir = async () => {
    setUnreadCir(0);
  };
  const updatenot = async () => {
    setUnreadNot(0);
  };

  async function deletePayoutDatabaseIfExists() {
    return new Promise((resolve, reject) => {
      // Try to open the database to see if it exists
      const openRequest = indexedDB.open("PayoutData");

      openRequest.onsuccess = function (event) {
        // If the database opens successfully, it exists
        const db = event.target.result;
        db.close(); // Close the connection before deleting

        // Proceed to delete the database
        const deleteRequest = indexedDB.deleteDatabase("PayoutData");

        deleteRequest.onsuccess = function () {
          // console.log("PayoutData database deleted successfully.");
          resolve();
        };

        deleteRequest.onerror = function (event) {
          console.error("Error deleting PayoutData database:", event);
          reject(event);
        };

        deleteRequest.onblocked = function () {
          console.warn(
            "Deletion of PayoutData database is blocked. Close all connections and try again."
          );
          reject(new Error("Deletion blocked"));
        };
      };

      openRequest.onerror = function (event) {
        // If opening the database fails, it may not exist
        console.warn("PayoutData database does not exist or cannot be opened.");
        resolve(); // Resolve without error since the database doesn't need to be deleted
      };
    });
  }

  const handleLogout = async () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    await deletePayoutDatabaseIfExists();
    toast.success("Logged out successfully", {
      position: "top-center",
    });
    setTimeout(() => {
      navigate("/");
      window.location.reload();
    }, 1000);
  };

  const navItems = [
    {
      name: "Pool Scrubbing",
      path: "/poolscrubbing",
      icon: <GiPoolTriangle />,
    },
    {
      name: "Payout Monitoring",
      path: "/payoutmonitoring",
      icon: <LuMonitorCheck />,
    },
    {
      name: "Loss Estimation",
      path: "/lossestimation",
      icon: <BsGraphDownArrow />,
    },
    {
      name: "Pool Reconciliation",
      path: "/poolreconciliation",
      icon: <AiOutlineReconciliation />,
    },
    {
      name: "Direct Assignment",
      path: "/directassignment",
      icon: <FaTasks />,
    },
    {
      name: "Co lending",
      path: "/colending",
      icon: <FaCoins />,
    },
    {
      name: "Securitization",
      path: "/securitization",
      icon: <RiSecurePaymentLine />,
    },
  ];

  return (
    <>
      <header className="sticky z-40 flex items-center justify-between py-1 bg-white shadow-md md:items-end">
        {/* Logo */}
        <Link to="/" className="flex items-center m-auto ml-4 mr-4">
          <img src={png1} alt="Logo" className="w-14" />
        </Link>

        {/* Navigation Links */}
        <ul
          className={`flex items-center font-medium gap-x-2 m-auto ${
            isMobileView ? "hidden" : "mx-auto"
          }`}
        >
          {navItems.map((item) => (
            <li key={item.name}>
              <Link
                to={item.path}
                className="flex items-center gap-1 px-1 py-2 text-gray-900 transition duration-300 rounded-md hover:text-orange-500 hover:bg-gradient-to-r from-orange-100 to-yellow-100 hover:scale-105"
                onClick={closeMobileMenu}
              >
                {React.cloneElement(item.icon, { className: "w-5 h-5" })}
                <span className="text-sm text-center">{item.name}</span>
              </Link>
            </li>
          ))}
        </ul>

        <div className="flex items-center gap-2 m-auto ml-auto mr-2">
          {/* Mobile Menu Button */}
          {isMobileView && (
            <button
              className="text-orange-500 hover:text-orange-400  duration-300 focus:outline-none transition-transform transform hover:scale-110 sm:block md:block lg:hidden"
              onClick={toggleMobileMenu}
              ref={mobileMenuRef}
            >
              <HiMenu className="w-6 h-6" />
            </button>
          )}

          {/* Fullscreen Icon */}
          <button
            type="button"
            className="p-2 transition-transform transform border rounded-full sm:flex md:flex lg:flex hover:bg-gradient-to-r from-orange-100 to-yellow-100 hover:scale-110"
            onClick={toggleFullscreen}
          >
            <BiFullscreen className="w-5 h-5 text-orange-500" />
          </button>

          {/* Notification Icon */}
          <div className="relative p-1" ref={notificationRef}>
            <button
              type="button"
              className="relative inline-flex items-center p-2 text-sm font-medium text-orange-500 transition-transform transform border rounded-full hover:bg-gradient-to-r from-orange-100 to-yellow-100 hover:scale-110"
              aria-haspopup="true"
              aria-expanded={isNotificationOpen}
              onClick={toggleNotification}
            >
              <IoIosNotificationsOutline
                className="w-5 h-5"
                aria-hidden="true"
              />
              {unreadCir + unreadNot > 0 && (
                <div className="absolute flex items-center justify-center w-4 h-4 text-[10px] font-bold text-white bg-red-500 border-2 border-white rounded-full -top-1 -right-1">
                  {unreadNot + unreadCir}
                </div>
              )}
            </button>
            {/* Notification Dropdown */}
            {isNotificationOpen && (
              <div className="absolute right-0 z-50 mt-2 bg-white rounded-md shadow-lg w-80">
                <Notification
                  unreadnot={unreadNot}
                  unreadcir={unreadCir}
                  updatenot={updatenot}
                  updatecir={updatecir}
                />
              </div>
            )}
          </div>
          {/* User Dropdown */}
          <div className="relative items-center w-8 h-8" ref={dropdownRef}>
            <button
              type="button"
              className="flex items-center transition-transform transform border rounded-full hover:scale-110 focus:outline-none"
              aria-haspopup="true"
              aria-expanded={isDropdownOpen}
              onClick={toggleDropdown}
            >
              {/* Profile Image or Initials */}
              {user.profilephoto ? (
                <img
                  className="w-8 h-8 rounded-full"
                  src={user.profilephoto}
                  alt="User Avatar"
                />
              ) : (
                <div className="flex items-center justify-center p-1 font-semibold text-orange-600 bg-orange-100 border border-red-500 text-md">
                  {user.firstname.charAt(0)}
                </div>
              )}
            </button>

            {/* User Dropdown Menu */}
            {isDropdownOpen && (
              <div className="absolute right-0 z-50 w-48 mt-2 bg-white rounded-md shadow-lg">
                <div className="py-2">
                  <span className="hidden px-4 py-2 m-auto font-medium text-orange-900 xl:inline-block">
                    {user.firstname} {user.lastname}
                  </span>
                  <Link
                    to="/profile"
                    className="flex items-center px-4 py-2 text-gray-700 transition duration-300 hover:bg-orange-200"
                  >
                    <i className="text-orange-400 align-middle mdi mdi-account-circle fs-16 me-1"></i>{" "}
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
                    className="flex items-center px-4 py-2 text-gray-700 transition duration-300 hover:bg-orange-200"
                  >
                    <i className="text-orange-400 align-middle mdi mdi-lock fs-16 me-1"></i>{" "}
                    Lockscreen
                  </Link>
                  {user.role === "Admin" && (
                    <Link
                      to="/admin"
                      className="flex items-center px-4 py-2 text-gray-700 transition duration-300 hover:bg-orange-200"
                    >
                      <i className="text-orange-400 align-middle mdi mdi-cog-outline fs-16 me-1"></i>{" "}
                      Admin panel
                    </Link>
                  )}
                  <div className="border-t border-gray-200"></div>
                  <Link
                    to="/"
                    onClick={handleLogout}
                    className="flex items-center px-4 py-2 text-gray-700 transition duration-300 hover:bg-orange-200"
                  >
                    <i className="text-orange-400 align-middle mdi mdi-logout fs-16 me-1"></i>{" "}
                    Sign out
                  </Link>
                </div>
              </div>
            )}
          </div>

          {/* Sidebar Toggle */}
        </div>
      </header>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <>
          {/* Overlay */}
          <div
            className="fixed inset-0 z-40 mt-16 bg-black opacity-50"
            onClick={closeMobileMenu}
          ></div>

          {/* Mobile Menu */}
          <div className="absolute left-0 z-50 w-full bg-white shadow-lg top-16">
            <div className="flex flex-col items-center p-4">
              {navItems.map((item) => (
                <Link
                  key={item.name}
                  to={item.path}
                  className="flex items-center w-full gap-2 px-4 py-2 text-center text-gray-900 transition duration-300 rounded-md hover:text-orange-500 hover:bg-gradient-to-r from-orange-100 to-yellow-100 hover:scale-105"
                  onClick={closeMobileMenu}
                >
                  {React.cloneElement(item.icon, { className: "w-5 h-5" })}
                  <span className="text-sm">{item.name}</span>
                </Link>
              ))}
            </div>
          </div>
        </>
      )}
    </>
  );
}

export default HomeNav;
