import React from "react";
import "./Slider.css";

const Slider = () => {
  return (
    <div className="flex items-center justify-center h-15  bg-gray-200">
      <div className="slider bg-white shadow h-24 overflow-hidden relative  mx-auto">
        <div className="slide-track flex animate-scroll">
          {Array.from({ length: 2 }).map((_, repeatIndex) =>
            Array.from({ length: 7 }).map((_, index) => (
              <div
                className="slide h-24 w-[250px]"
                key={`${repeatIndex}-${index}`}
              >
                <img
                  src={`https://s3-us-west-2.amazonaws.com/s.cdpn.io/557257/${
                    index + 1
                  }.png`}
                  height="100"
                  width="250"
                  alt={`Slide ${index + 1}`}
                />
              </div>
            ))
          )}
        </div>
      </div>
    </div>
  );
};

export default Slider;
