import React, { useState, useEffect } from "react";
import Cookies from "js-cookie";

const CookieConsentBanner = () => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    const consent = Cookies.get("cookieConsent");
    // console.log("Cookie consent status:", consent); // Debugging log for cookie status

    if (!consent) {
      setIsVisible(true);
      // console.log("Banner is set to visible"); // Debugging log
    }
  }, []);

  const handleAcceptAll = () => {
    Cookies.set("cookieConsent", "all", { expires: 365 });
    setIsVisible(false);
    // console.log("Cookies accepted"); // Debugging log
  };

  const handleRejectCookies = () => {
    Cookies.set("cookieConsent", "rejected", { expires: 365 });
    setIsVisible(false);
    // console.log("Cookies rejected"); // Debugging log
  };

  if (!isVisible) return null;

  return (
    <div className={`fixed bottom-0 left-0 right-0 bg-gray-800 text-white p-4 flex flex-col items-center space-y-2 md:space-y-0 md:flex-row md:justify-between md:px-8 z-50 transition-opacity duration-500 ${isVisible ? 'opacity-100' : 'opacity-0'}`}>
      <p className="text-center md:text-left">
        We use cookies to enhance your experience. By continuing to visit this
        site, you agree to our use of cookies.
      </p>
      <div className="flex space-x-2">
        <button
          onClick={handleAcceptAll}
          className="bg-orange-500 text-white px-4 py-2 rounded-md hover:bg-orange-600 focus:outline-none"
        >
          Accept
        </button>
        {/* Uncomment if you want a partial consent option */}
        {/* <button
          onClick={handleAcceptSome}
          className="bg-yellow-500 text-white px-4 py-2 rounded-md hover:bg-yellow-600 focus:outline-none"
        >
          Accept Some Cookies
        </button> */}
        <button
          onClick={handleRejectCookies}
          className="bg-red-500 text-white px-4 py-2 rounded-md hover:bg-red-600 focus:outline-none"
        >
          Reject
        </button>
      </div>
    </div>
  );
};

export default CookieConsentBanner;
