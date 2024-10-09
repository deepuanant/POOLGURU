import React, { useRef } from "react";
import { motion } from "framer-motion";
import png2 from "../../assets/hero1.svg";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { fadeIn } from "../common/FadeIn";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

function Hero1() {
  const ref = useRef(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.1 });

  return (
    <section className="bg-gradient-to-r from-orange-100 to-gray-100 dark:from-orange-200 dark:to-gray-200 flex justify-center p-6">
      <div className="flex flex-col lg:grid lg:grid-cols-2 items-center gap-8 xl:gap-10 max-w-screen-xl py-2 mx-auto space-y-10 lg:space-y-0 lg:py-12 lg:px-2">
        
        {/* Mobile View: Image on Top */}
        <motion.img
          className="w-full lg:hidden rounded-lg shadow-lg"
          src={png2}
          alt="Banner"
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          variants={fadeIn("up", 0.2)}
          transition={{ duration: 0.5, ease: "easeInOut" }} // Improved transition
        />

        {/* Text Content */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          variants={fadeIn("up", 0.2)}
          transition={{ duration: 0.5, ease: "easeInOut" }} // Unified transition
          className="text-gray-500 sm:text-lg dark:text-gray-400 flex-1"
        >
          <motion.h2
            className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500"
          >
            Secure the Core, Streamline Compliance
          </motion.h2>
          <motion.p
            variants={fadeIn("up", 0.4)}
            transition={{ duration: 0.5, ease: "easeInOut" }} // Improved transition
            className="mb-8 text-gray-700 lg:text-xl"
          >
            Empowering Banks and NBFCs with Cutting-Edge Risk Assessment and
            Seamless Regulatory Compliance.
          </motion.p>
          <div className="space-y-4 sm:flex sm:space-x-4 sm:space-y-0">
            <Link
              to="/signup"
              className="flex items-center justify-center text-white bg-gradient-to-r from-orange-500 to-yellow-500 border-2 rounded-lg px-4 py-2 font-medium text-base dark:text-orange-400 dark:hover:text-orange-500  duration-300 cursor-pointer transition-transform transform hover:scale-105"
              >
              <span className="mr-2">Get Started</span>
              <FiArrowRight />
            </Link>
            <Link
              to="/Contactus"
              className="flex items-center justify-center bg-white text-orange-400 hover:text-white hover:bg-gradient-to-r from-orange-500 to-yellow-500 border-2 rounded-lg px-4 py-2 font-medium text-base dark:text-orange-400 dark:hover:text-orange-500  duration-300 cursor-pointer transition-transform transform hover:scale-105">
            
              <i className="mdi mdi-calendar-check mr-2"></i>Book Demo
            </Link>
          </div>
        </motion.div>

        {/* Desktop View: Image on Right */}
        <motion.img
          className="hidden lg:block w-full mb-2 rounded-lg shadow-lg"
          src={png2}
          alt="Banner"
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          variants={fadeIn("up", 0.2)}
          transition={{ duration: 0.5, ease: "easeInOut" }} // Improved transition
        />
      </div>
    </section>
  );
}

export default Hero1;
