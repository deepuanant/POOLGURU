import React, { useState, useEffect } from "react";

const ScrollToTopButton = ({ topRef }) => {
  const [isVisible, setIsVisible] = useState(false);

  const handleScroll = () => {
    const scrollPosition = window.scrollY;
    setIsVisible(scrollPosition > 100);
  };

  const scrollToTop = () => {
    // console.log("Scroll to top button clicked");
    if (topRef && topRef.current) {
      // Scroll to the referenced element
      topRef.current.scrollIntoView({ behavior: "smooth" });
    } else {
      // Fallback to window scroll if no topRef is provided
      window.scrollTo({ top: 0, behavior: "smooth" });
    }
  };

  useEffect(() => {
    window.addEventListener("scroll", handleScroll);
    return () => {
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  return (
    <div
      className={`fixed transition-opacity duration-300 bottom-5 right-5 ${
        isVisible ? "opacity-100" : "opacity-0"
      }`}
      style={{ zIndex: 10000 }}
    >
      <button
        onClick={scrollToTop}
        className="flex items-center justify-center w-8 h-8 text-white bg-gradient-to-r from-orange-500 to-yellow-500 rounded shadow-lg hover:bg-orange-600 animate-bounce"
      >
        <i className="fa fa-arrow-up"></i>
      </button>
    </div>
  );
};

export default ScrollToTopButton;
