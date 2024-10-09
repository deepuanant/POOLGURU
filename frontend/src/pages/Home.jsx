import React from "react";
import { ReactTyped } from "react-typed";
import Globe from "../components/Home/Globe";
import CookieConsentBanner from "./Cookiesbanner";
import New1 from "../components/Home/New1";
import Circular from "../components/Home/Circular";

function HomePage() {
  return (
    <>
      <div className="relative z-0 min-h-screen overflow-hidden">
        {/* Background Globe Animation */}
        <div className="absolute inset-0 z-0">
          <Globe />
        </div>

        {/* Cookie Consent Banner */}
        <div className="fixed bottom-0 z-50 w-full">
          <CookieConsentBanner />
        </div>

        {/* Typed Animation Text */}
        <div className="relative h-[450px] flex items-center justify-center">
          <div className="absolute w-full text-center top-20">
            <h1 className="lg:w-[50%] sm:w-[100%] md:text-7xl mb-4 text-4xl font-extrabold tracking-tight text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-gray-900">
              <ReactTyped
                strings={["Transforming Complexity into Confidence!"]}
                typeSpeed={150}
                backSpeed={150}
                backDelay={2000}
                loop={true}
                showCursor={true}
                cursorChar="|"
              />
            </h1>
          </div>
        </div>

        {/* Flex Container for Circular and New1 */}
        <div className="flex flex-wrap justify-center p-4">
          <div className="w-full p-2 md:w-1/2">
            <Circular />
          </div>
          <div className="w-full p-2 md:w-1/2">
            <New1 />
          </div>
        </div>
      </div>
    </>
  );
}

export default HomePage;