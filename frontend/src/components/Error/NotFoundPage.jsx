import React from "react";
import { Link } from "react-router-dom";

const NotFoundPage = () => {
  return (
    <div>
      <div className="min-h-screen bg-gradient-to-r from-orange-100 to-gray-100 bg-cover bg-center flex justify-center items-center relative overflow-hidden">
        <div className="absolute inset-0"></div>
        <div className="relative z-10 p-5">
          <div className="max-w-lg mx-auto bg-white rounded-lg shadow-lg overflow-hidden">
            <div className="p-6 text-center">
              <lord-icon
                className="mx-auto mb-4"
                src="https://cdn.lordicon.com/etwtznjn.json"
                trigger="loop"
                colors="primary:#f57c00,secondary:#ffcc00"
                style={{ width: "7.6rem", height: "7.6rem" }}
              ></lord-icon>
              <h1 className="text-3xl font-bold text-primary mb-4">Oops !</h1>
              <h4 className="text-lg font-semibold text-gray-700 mb-2">
                Sorry, Page not Found 😭
              </h4>
              <p className="text-gray-500 mb-6">
                The page you are looking for is not available!
              </p>
              <Link
                to="/"
                className="inline-flex w-full items-center justify-center text-white bg-gradient-to-r from-orange-500 to-yellow-500 border-2 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition transform hover:-translate-y-1 hover:scale-105 shadow-lg"
              >
                <i className="mdi mdi-home mr-2"></i>Back to home
              </Link>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default NotFoundPage;
