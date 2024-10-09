import React from "react";
import Hero1 from "../components/landing/Hero1";
import Hero2 from "../components/landing/Hero2";
import Hero3 from "../components/landing/Hero3";
import Trust from "../components/landing/Trust";
import Howitworks from "../components/landing/Howitworks";

function Landing() {

  return (
    <div>
      {/* Add an invisible div to serve as the top anchor point */}

      <Hero1 />
      <Hero2 />
      <Hero3 />
      <Howitworks />
      {/* <Hero4 /> */}
      <Trust />
    </div>
  );
}

export default Landing;
