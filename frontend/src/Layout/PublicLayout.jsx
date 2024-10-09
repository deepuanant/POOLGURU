import { useLocation } from "react-router-dom";
import Navbar from "../components/miscellaneous/NavL";
import OtherFooter from "../components/landing/OtherFooter";
import Footer from "../components/landing/Footer";
import ScrollToTopButton from "../components/miscellaneous/ScrollToTopButton";
import { useRef } from "react";

const PublicLayout = ({ children }) => {
  const topRef = useRef(null);
  const location = useLocation();
  const showOtherFooter = [
    "/resource",
    "/services",
    "/aboutus",
    "/teams",
    "/contactus",
    "/terms",
    "/faq",
    "/signup",
    "/login",
    "/404error",
    "/verify-otp",
    "/forgot-password",
  ].includes(location.pathname);

  return (
    <>
      <Navbar />
      <div className="content">{children}</div>
      <ScrollToTopButton topRef={topRef} />
      {showOtherFooter ? <OtherFooter /> : <Footer />}
    </>
  );
};

export default PublicLayout;
