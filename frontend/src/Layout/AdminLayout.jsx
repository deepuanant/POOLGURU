import React, { useState, useEffect } from "react";
import Sidebar from "../components/Admin/components/Sidebar ";
// import { Outlet } from "react-router-dom";
import AdminNavbar from "../components/Admin/components/AdminNavbar";

function AdminLayout({ children }) {
  const [isSidebarCollapsed, setIsSidebarCollapsed] = useState(true); // Initially collapsed
  const [isMobile, setIsMobile] = useState(false);

  const toggleSidebar = () => {
    setIsSidebarCollapsed((prev) => !prev);
  };

  useEffect(() => {
    const handleResize = () => {
      const mobileCheck = window.innerWidth <= 1024;
      setIsMobile(mobileCheck);
      if (mobileCheck) {
        setIsSidebarCollapsed(true); // Always start collapsed on mobile
      } else {
        setIsSidebarCollapsed(false); // Expand by default on larger screens
      }
    };

    window.addEventListener("resize", handleResize);
    handleResize(); // Call on mount

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <>
      <AdminNavbar
        toggleSidebar={toggleSidebar}
        isCollapsed={isSidebarCollapsed}
        className="fixed top-0 left-0 w-full z-50"
      />
       
       {localStorage.token && (
        <div className="flex pt-16">
          <Sidebar
            isCollapsed={isSidebarCollapsed}
            toggleSidebar={toggleSidebar}
            isMobile={isMobile}
          />
          <div
            className={`flex-1 transition-all duration-300 ${
              !isSidebarCollapsed && !isMobile ? "ml-64" : "ml-0"
            } overflow-y-auto min-h-screen`}
          >
            <div className=" ">{children}</div>
          </div>
        </div>
      )}
    </>
  );
}

export default AdminLayout;
