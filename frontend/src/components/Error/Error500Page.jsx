import React from "react";
import { Link } from "react-router-dom";
import error from "../../assets/error500.png";

const Error500Page = () => {
  return (
    <div className="min-h-screen flex justify-center items-center py-5 bg-gradient-to-r from-orange-100 to-gray-100">
      <div className="relative flex flex-col items-center">
        <div className="relative flex justify-center items-center">
          <img
            src={error}
            alt="500 Error"
            className="w-80 h-auto animate-slideLeftRight absolute"
            // Adjust this value to move the image upwards
          />
          <h1 className="text-orange-300 text-[14rem] font-extrabold">500</h1>
        </div>
        <div className="text-center">
          <h4 className="text-2xl font-semibold text-gray-800">
            Internal Server Error!
          </h4>
          <p className="text-gray-600 mt-2 mx-auto w-3/4">
            Server Error 500. We're not exactly sure what happened, but our
            servers say something is wrong.
          </p>
          <Link
            to="/"
            className="inline-block mt-6 bg-orange-400 text-white py-2 px-2 p-3 rounded-lg shadow-md hover:bg-orange-500 transition"
          >
            <i className="mdi mdi-home mr-2 mb-0 ">&larr;</i>Back to home
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Error500Page;
