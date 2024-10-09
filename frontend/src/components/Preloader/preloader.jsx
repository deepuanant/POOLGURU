import React, { useEffect, useState } from "react";
import Lottie from "react-lottie-player";
import loaderAnimation from "../Home/infinity loader.json"; // Adjust the path if needed

function Preloader() {
  const [isAnimationLoaded, setIsAnimationLoaded] = useState(false);

  // Defer the animation loading until after the first paint
  useEffect(() => {
    setIsAnimationLoaded(true);
  }, []);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="relative flex items-center justify-center border-orange-400 p-6 md:p-10 lg:p-14">
        {/* "pl" Text */}
        <span className="text-orange-500 text-3xl md:text-4xl lg:text-5xl font-bold mr-2 md:mr-5">
          P
        </span>

        {/* "oo" Loader */}
        {isAnimationLoaded && (
          <div className="absolute items-center justify-center left-[27%] md:left-[30%] lg:left-[29%] transform -translate-x-[50%]">
            <Lottie
              loop
              animationData={loaderAnimation}
              play
              className="md:w-64 md:h-64 lg:w-80 lg:h-80"
            />
          </div>
        )}

        {/* "guru" Text */}
        <span className="text-orange-500 text-3xl md:text-4xl lg:text-5xl font-bold ml-8 md:ml-16">
          L G U R U
        </span>
      </div>
    </div>
  );
}

export default Preloader;
