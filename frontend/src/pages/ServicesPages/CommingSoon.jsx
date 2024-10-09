import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';

const CommingSoon = () => {
  const [timeLeft, setTimeLeft] = useState({ days: 0, hours: 0, minutes: 0, seconds: 0 });

  useEffect(() => {
    const targetDate = new Date('2024-12-30T23:59:59');

    const updateCountdown = () => {
      const now = new Date();
      const difference = targetDate - now;

      if (difference <= 0) {
        setTimeLeft({ days: 0, hours: 0, minutes: 0, seconds: 0 });
      } else {
        const days = Math.floor(difference / (1000 * 60 * 60 * 24));
        const hours = Math.floor((difference % (1000 * 60 * 60 * 24)) / (1000 * 60 * 60));
        const minutes = Math.floor((difference % (1000 * 60 * 60)) / (1000 * 60));
        const seconds = Math.floor((difference % (1000 * 60)) / 1000);

        setTimeLeft({ days, hours, minutes, seconds });
      }
    };

    const intervalId = setInterval(updateCountdown, 1000);

    return () => clearInterval(intervalId);
  }, []);

  return (
    <div
      className="relative h-screen w-full flex flex-col items-center justify-center text-center text-white bg-cover bg-center"
      style={{
        backgroundImage:
          'url(https://images.unsplash.com/photo-1551434678-e076c223a692?ixlib=rb-1.2.1&ixid=eyJhcHBfaWQiOjEyMDd9&auto=format&fit=crop&w=2850&q=80)',
      }}
    >
      <div className="absolute inset-0 bg-gray-900 opacity-75" />
      <div className="z-10 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 mb-6">
        COMING SOON!
      </div>
      <div className="flex items-center justify-center z-10 space-x-4">
        {Object.entries(timeLeft).map(([unit, value], idx) => (
          <div
            key={idx}
            className="flex flex-col items-center justify-center min-w-[80px] text-center"
          >
            <span className="block text-3xl sm:text-6xl font-bold text-orange-500">{value}</span>
            <p className="text-lg sm:text-xl">{unit.charAt(0).toUpperCase() + unit.slice(1)}</p>
          </div>
        ))}
      </div>
      <div className="rounded-md shadow z-10 mt-8">
        <Link
          to="/"
          className="w-full px-8 py-3 border border-transparent text-base leading-6 font-medium rounded-full text-white bg-orange-500 hover:bg-orange-400 focus:outline-none focus:border-orange-600 focus:shadow-outline-orange transition duration-150 ease-in-out md:py-4 md:text-lg md:px-16"
        >
          Still working on pages
        </Link>
      </div>
    </div>
  );
};

export default CommingSoon;
