import React from 'react';
import Lottie from 'react-lottie-player';
import loaderAnimation from './infinity loader.json'; // Adjust the path if needed

const LoadingSpinner = ({ message}) => {
  return (
    <div className="fixed inset-0 flex flex-col items-center justify-center bg-gray-800 bg-opacity-75 z-50">
      <Lottie
        loop
        animationData={loaderAnimation}
        play
        style={{ width: 400, height: 400 }}
      />
      {/* Display the dynamic message */}
      <p className="mt-4 text-orange-500 font-bold tracking-wide text-center text-3xl">{message}</p>
    </div>
  );
};

export default LoadingSpinner;
