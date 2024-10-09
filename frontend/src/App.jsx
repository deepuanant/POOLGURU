import React, { useState, useEffect } from "react";
import {
  BrowserRouter as Router,
  Routes,
  Route,
  Navigate,
} from "react-router-dom";
import { jwtDecode } from "jwt-decode"; // Added jwt-decode
import { useSelector, useDispatch } from "react-redux";
import { io } from "socket.io-client";
import { Toaster } from "react-hot-toast";
import Landing from "./pages/Landing";
import Services from "./pages/Services";
import SignUp from "./pages/SignUp";
import SignIn from "./pages/SignIn";
import Home from "./pages/Home";
import Dashboard from "./pages/Dashboard";
import Private from "./Private/Private";
import Verify from "./pages/Verify";
import Contactus from "./components/miscellaneous/Contactus";
import TermsAndConditions from "./pages/TermsAndConditions";
import Resetpass1 from "./pages/Resetpass1";
import Changepassword from "./pages/Resetpassword2";
import FAQ from "./components/miscellaneous/FAQ";
import Feed from "./components/Admin/Feed/Feed";
import AboutUs from "./components/AboutUs/aboutus";
import OurTeams from "./components/OurTeams/Teams";
import PayoutMonitoring from "./pages/ServicesPages/PayoutMonitoring";
import NotFoundPage from "./components/Error/NotFoundPage";
import Error500Page from "./components/Error/Error500Page";
import ErrorBoundary from "./components/Error/ErrorBoundary";
import NotificationPage from "./components/Admin/Notification/Sendnotification";
import GoogleAuthCallback from "./pages/GoogleAuthCallback";
import Circularupload from "./components/Admin/Circular/Circularuplaod";
import PublicLayout from "./Layout/PublicLayout";
import PrivateLayout from "./Layout/PrivateLayout";
import AdminLayout from "./Layout/AdminLayout";
import Lockscreen from "./pages/Lockscreen";
import Editnotification from "./components/Admin/Notification/Editnotification";
import EditCircular from "./components/Admin/Circular/EditCircular";
import UserTable from "./components/Admin/Users/Userlist";
import PoolScrubbing from "./pages/ServicesPages/PoolScrubbing";
import LossEstimation from "./pages/ServicesPages/LossEstimation";
import PoolReconciliation from "./pages/ServicesPages/PoolReconciliation";
import DirectAssignment from "./pages/ServicesPages/DirectAssignment";
import CoLending from "./pages/ServicesPages/CoLending";
import Securitization from "./pages/ServicesPages/Securitization";
import OTP2FAVerification from "./pages/Verify2FAOTP";
import AdminHome from "./components/Admin/components/AdminHome";
import PaymentMonitoring from "../src/components/PayoutMonitoring/ExcelUtility/PayMonitoring";
import Demo from "./pages/DemoChart";
import SettingsPage from "../src/components/Profile/Setting";
import Profile from "../src/components/Profile/Profile";
import PayoutAnalysisReport from "../src/components/PayoutMonitoring/PayoutAnalysisReport";
import AutoLogout from "./pages/AutoLogout";
import Preloader from "./components/Preloader/preloader";
import { clearUser } from "./Redux/userslice";
function App() {
  const user = useSelector((state) => state.user);
  const isVerified = user?.isVerified;
  const [socket, setSocket] = useState(null);
  const [isAppLoading, setIsAppLoading] = useState(true); // State for initial loading

  const [isLocked, setIsLocked] = useState(
    localStorage.getItem("isLocked") === "true"
  );
  const dispatch = useDispatch()
  useEffect(() => {
    const newSocket = io("https://backend-ygnm.onrender.com");
    setSocket(newSocket);
    return () => newSocket.close();
  }, []);
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (token) {
      const decodedToken = jwtDecode(token);
      const currentTime = Date.now() / 1000; // Get current time in seconds

      // If token is expired, log the user out
      if (decodedToken.exp < currentTime) {
        dispatch(clearUser()); // Dispatch logout action
      }
    }
  }, [dispatch]);
  useEffect(() => {
    if (socket) {
      socket?.emit("newUser", user?.username || "Visitor");
      // console.log("User Connected to Socket");
    }
  }, [socket, user]);

  useEffect(() => {
    if (socket) {
      socket.on("rolechanged", (data) => {
        localStorage.setItem("user", JSON.stringify(data.User));
      });

      socket.on("notification", (data) => {
        // console.log("Notification:", data);
      });

      return () => {
        socket.off("rolechanged");
      };
    }
  }, [socket]);

  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.ctrlKey && e.key === "l") {
        localStorage.setItem("isLocked", "true");
        sessionStorage.setItem("previousPage", window.location.pathname);
        setIsLocked(true);
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, []);

  const handleUnlock = () => {
    setIsLocked(false);
  };
  useEffect(() => {
    const fetchData = async () => {
      // Simulate a data fetch delay (You can replace this with actual startup logic)
      await new Promise((resolve) => setTimeout(resolve, 2000));

      // Set loading state to false once the initial load is complete
      setIsAppLoading(false);
    };
    fetchData();
  }, []);

  // If the app is initially loading, show the preloader
  if (isAppLoading) {
    return <Preloader />;
  }


  return (
    <Router>
      <ErrorBoundary>
        <Toaster />
        {isLocked && <Lockscreen onUnlock={handleUnlock} isLocked={isLocked} />}
        <AutoLogout />
        <Routes>
          {/* Public Routes */}
          <Route
            path="/"
            element={
              isVerified ? (
                <PrivateLayout>
                  <Home />
                </PrivateLayout>
              ) : (
                <PublicLayout>
                  <Landing />
                </PublicLayout>
              )
            }
          />
          <Route
            path="/aboutus"
            element={
              <PublicLayout>
                <AboutUs />
              </PublicLayout>
            }
          />
          <Route
            path="/teams"
            element={
              <PublicLayout>
                <OurTeams />
              </PublicLayout>
            }
          />
          <Route
            path="/contactus"
            element={
              <PublicLayout>
                <Contactus />
              </PublicLayout>
            }
          />
          <Route
            path="/terms"
            element={
              <PublicLayout>
                <TermsAndConditions />
              </PublicLayout>
            }
          />
          <Route
            path="/faq"
            element={
              <PublicLayout>
                <FAQ />
              </PublicLayout>
            }
          />
          <Route
            path="/services"
            element={
              <PublicLayout>
                <Services />
              </PublicLayout>
            }
          />
          <Route
            path="/signup"
            element={
              <PublicLayout>
                <SignUp />
              </PublicLayout>
            }
          />
          <Route
            path="/login"
            element={
              <PublicLayout>
                <SignIn />
              </PublicLayout>
            }
          />
          <Route
            path="/verify-otp"
            element={
              <PublicLayout>
                <Verify />
              </PublicLayout>
            }
          />
          <Route
            path="/verify-2fa"
            element={
              <PublicLayout>
                <OTP2FAVerification />
              </PublicLayout>
            }
          />
          <Route
            path="/forgot-password"
            element={
              <PublicLayout>
                <Resetpass1 />
              </PublicLayout>
            }
          />
          <Route
            path="/*"
            element={
              <PublicLayout>
                <NotFoundPage />
              </PublicLayout>
            }
          />
          <Route
            path="/auth/google/callback"
            element={<GoogleAuthCallback />}
          />
          <Route path="/500error" element={<Error500Page />} />
          <Route path="/change-password/:token" element={<Changepassword />} />

          {/* Private Routes */}
          <Route element={<Private />}>
            <Route
              path="/payoutmonitoring"
              element={
                <PrivateLayout>
                  <PayoutMonitoring />
                </PrivateLayout>
              }
            />
            <Route
              path="/payoutmonitoring/report"
              element={
                <PrivateLayout>
                  <PayoutAnalysisReport />
                </PrivateLayout>
              }
            />
            <Route
              path="/poolscrubbing"
              element={
                <PrivateLayout>
                  <PoolScrubbing />
                </PrivateLayout>
              }
            />
            <Route
              path="/lossestimation"
              element={
                <PrivateLayout>
                  <LossEstimation />
                </PrivateLayout>
              }
            />
            <Route
              path="/poolreconciliation"
              element={
                <PrivateLayout>
                  <PoolReconciliation />
                </PrivateLayout>
              }
            />
            <Route
              path="/directassignment"
              element={
                <PrivateLayout>
                  <DirectAssignment />
                </PrivateLayout>
              }
            />
            <Route
              path="/colending"
              element={
                <PrivateLayout>
                  <CoLending />
                </PrivateLayout>
              }
            />
            <Route
              path="/securitization"
              element={
                <PrivateLayout>
                  <Securitization />
                </PrivateLayout>
              }
            />
            <Route
              path="/dashboard"
              element={
                <PrivateLayout>
                  <Dashboard />
                </PrivateLayout>
              }
            />
            <Route
              path="/profile"
              element={
                <PrivateLayout>
                  <Profile />
                </PrivateLayout>
              }
            />
            <Route
              path="/Setting"
              element={
                <PrivateLayout>
                  <SettingsPage />
                </PrivateLayout>
              }
            />

            {/* Admin Routes inside Private Route */}
            <Route path="/admin" element={<Navigate to="/admin/home" />} />
            <Route
              path="/admin/*"
              element={
                <AdminLayout>
                  <Routes>
                    <Route path="home" element={<AdminHome />} />
                    <Route path="feed" element={<Feed />} />
                    <Route
                      path="edit-notification"
                      element={<Editnotification />}
                    />
                    <Route path="edit-circular" element={<EditCircular />} />
                    <Route path="user-list" element={<UserTable />} />
                    <Route
                      path="send-notification"
                      element={<NotificationPage />}
                    />
                    <Route
                      path="circular-upload"
                      element={<Circularupload />}
                    />
                    {/* Add other admin routes here */}
                    <Route path="*" element={<NotFoundPage />} />
                  </Routes>
                </AdminLayout>
              }
            />
          </Route>

          {/* Catch-all route for 404 errors */}
          <Route path="*" element={<NotFoundPage />} />
          <Route
            path="/lockscreen"
            element={<Lockscreen onUnlock={handleUnlock} />}
          />
          <Route path="/payment-monitoring" element={<PaymentMonitoring />} />
          <Route path="/demo" element={<Demo />} />
        </Routes>
      </ErrorBoundary>
    </Router>
  );
}

export default App;
