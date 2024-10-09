import React from "react";

const Card = ({ children }) => {
  return (
    <div className="flex flex-col w-full p-2 rounded-lg md:flex-row">
      <div className="w-full p-2">
        <div className="transition-all duration-300 ease-in-out hover:-translate-y-2 p-2 bg-white shadow-lg border border-slate-200 rounded-2xl">
          {children}
        </div>
      </div>
    </div>
  );
};

export default Card;
