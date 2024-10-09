import React from "react";

function RadialMenu() {
  return (
    <div className=" flex min-h-screen items-center justify-center bg-white  dark:bg-gray-900">
      {/* Desktop Version */}
      <div className="relative hidden h-80 w-80 items-center justify-center lg:flex">
        {/* Background Circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          {/* Large Circle */}
          <div className="absolute h-[150%] w-[150%] rounded-full bg-blue-100 opacity-30 dark:bg-blue-800"></div>
          {/* Medium Circle */}
          <div className="absolute h-[100%] w-[100%] rounded-full bg-blue-200 opacity-50 dark:bg-blue-700"></div>
          {/* Small Circle */}
          <div className="absolute h-[75%] w-[75%] rounded-full bg-blue-300 opacity-70 dark:bg-blue-600"></div>
        </div>

        {/* Center Circle */}
        <div className="absolute z-10 flex h-32 w-32 items-center justify-center rounded-full bg-white shadow-lg dark:bg-gray-800">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            className="h-16 w-16 text-blue-500 dark:text-blue-400"
            viewBox="0 0 20 20"
            fill="currentColor"
            aria-label="Center Icon"
          >
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
        </div>

        {/* Satellite Circles */}
        {[
          {
            top: "10%",
            left: "10%",
            color: "text-purple-500 dark:text-purple-400",
            transform: "translate(-50%, -50%)",
          },
          {
            top: "10%",
            right: "10%",
            color: "text-orange-500 dark:text-orange-400",
            transform: "translate(50%, -50%)",
          },
          {
            bottom: "10%",
            left: "10%",
            color: "text-gray-500 dark:text-gray-400",
            transform: "translate(-50%, 50%)",
          },
          {
            bottom: "10%",
            right: "10%",
            color: "text-blue-500 dark:text-blue-400",
            transform: "translate(50%, 50%)",
          },
          {
            top: "50%",
            right: "-50%",
            color: "text-teal-500 dark:text-teal-400",
            transform: "translate(50%, -50%)",
          },
          {
            top: "50%",
            left: "-50%",
            color: "text-yellow-500 dark:text-yellow-400",
            transform: "translate(-50%, -50%)",
          },
        ].map((position, index) => (
          <div
            key={index}
            className="absolute z-10 flex h-24 w-24 items-center justify-center rounded-full bg-white shadow-lg dark:bg-gray-800"
            style={{
              top: position.top,
              left: position.left,
              bottom: position.bottom,
              right: position.right,
              transform: position.transform,
            }}
          >
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-12 w-12 ${position.color}`}
              viewBox="0 0 20 20"
              fill="currentColor"
              aria-label={`Position ${index + 1} Icon`}
            >
              <path
                fillRule="evenodd"
                d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        ))}
      </div>

      {/* Mobile Version */}
      <div className="relative mx-auto block aspect-square w-full max-w-md lg:hidden">
        {/* Background Circles */}
        <div className="absolute inset-0 flex items-center justify-center">
          <div className="absolute h-[100%] w-[100%] rounded-full bg-blue-50 opacity-50 dark:bg-blue-900"></div>
          <div className="absolute h-[80%] w-[80%] rounded-full bg-blue-100 opacity-70 dark:bg-blue-800"></div>
          <div className="absolute h-[60%] w-[60%] rounded-full bg-blue-200 opacity-80 dark:bg-blue-700"></div>
        </div>

        {/* Center Circle */}
        <div className="absolute left-1/2 top-1/2 z-20 flex aspect-square w-[20%] -translate-x-1/2 -translate-y-1/2 transform items-center justify-center rounded-full bg-white shadow-lg dark:bg-gray-800">
          <div className="flex h-3/5 w-3/5 items-center justify-center rounded-full bg-blue-500 dark:bg-blue-400">
            <svg
              xmlns="http://www.w3.org/2000/svg"
              className="h-3/5 w-3/5 text-white dark:text-gray-800"
              viewBox="0 0 20 20"
              fill="currentColor"
            >
              <path
                fillRule="evenodd"
                d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                clipRule="evenodd"
              />
            </svg>
          </div>
        </div>

        {/* Satellite Circles */}
        {[
          {
            top: "27%",
            left: "27%",
            color: "bg-purple-500 dark:bg-purple-400",
          },
          {
            top: "26%",
            right: "12%",
            color: "bg-orange-500 dark:bg-orange-400",
          },
          { bottom: "10%", left: "27%", color: "bg-gray-500 dark:bg-gray-400" },
          {
            bottom: "12%",
            right: "10%",
            color: "bg-blue-500 dark:bg-blue-400",
          },
          { top: "50%", right: "-10%", color: "bg-teal-500 dark:bg-teal-400" },
          { top: "50%", left: "6%", color: "bg-yellow-500 dark:bg-yellow-400" },
        ].map((position, index) => (
          <div
            key={index}
            className="absolute z-10 flex aspect-square w-[15%] items-center justify-center rounded-full bg-white shadow-lg dark:bg-gray-800"
            style={{
              top: position.top,
              left: position.left,
              bottom: position.bottom,
              right: position.right,
              transform: "translate(-50%, -50%)",
            }}
          >
            <div
              className={`h-3/5 w-3/5 rounded-full ${position.color} flex items-center justify-center`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-3/5 w-3/5 text-white dark:text-gray-800"
                viewBox="0 0 20 20"
                fill="currentColor"
              >
                <path
                  fillRule="evenodd"
                  d="M16.707 5.293a1 1 0 010 1.414l-8 8a1 1 0 01-1.414 0l-4-4a1 1 0 011.414-1.414L8 12.586l7.293-7.293a1 1 0 011.414 0z"
                  clipRule="evenodd"
                />
              </svg>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

export default RadialMenu;
