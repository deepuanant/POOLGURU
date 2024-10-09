import React, { useRef } from "react";
import { motion } from "framer-motion";
import png3 from "../../assets/device.svg";
import { fadeIn } from "../common/FadeIn";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

function Hero3() {
  const ref = useRef(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.1 });

  const imageVariants = {
    hidden: { opacity: 0, x: -100 },
    show: {
      opacity: 1,
      x: 0,
      transition: { duration: 0.5, ease: "easeInOut" }, // Improved transition
    },
  };

  return (
    <section className="bg-gradient-to-r from-orange-100 to-gray-100 dark:from-orange-200 dark:to-gray-200">
      <div className="items-center gap-8 lg:grid lg:grid-cols-2 xl:gap-16 max-w-screen-xl px-4 py-4 mx-auto space-y-10 lg:space-y-15 lg:py-12 lg:px-6">
        
        {/* Text Content */}
        <motion.div
          ref={ref}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          variants={fadeIn('up', 0.2)}
          transition={{ duration: 0.5, ease: "easeInOut" }} // Unified transition
          className="text-gray-500 sm:text-lg dark:text-gray-400"
        >
          {/* Mobile Image */}
          <div className="block lg:hidden mb-8">
            <motion.img
              src={png3}
              alt="dashboard"
              className="rounded-lg shadow-lg"
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              variants={imageVariants}
            />
          </div>

          <motion.h2
            className="mb-4 text-3xl font-extrabold tracking-tight text-gray-900 dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500"
          >
            Integrate Seamlessly, Operate Efficiently
          </motion.h2>
          <motion.p
            variants={fadeIn('up', 0.4)}
            transition={{ duration: 0.5, ease: "easeInOut" }} // Improved transition
            className="mb-8 text-gray-700 lg:text-xl"
          >
            Optimize your financial operations with streamlined tools that
            enhance service delivery, eliminate complexity, and ensure compliance.
          </motion.p>
          <ul className="pt-8 space-y-5 border-t border-gray-200 my-7 dark:border-gray-700">
            {[
              "Real-time Data Analysis",
              "User-Friendly & Self-Serve",
              "Seamless System Integration",
              "Dynamic reports and dashboards",
              "Advanced Risk Assessment Tools",
            ].map((item) => (
              <li key={item} className="flex space-x-3">
                <svg
                  className="flex-shrink-0 w-5 h-5 text-orange-500 dark:text-orange-400"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                  xmlns="http://www.w3.org/2000/svg"
                >
                  <path
                    fillRule="evenodd"
                    d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
                    clipRule="evenodd"
                  />
                </svg>
                <span className="text-base font-medium leading-tight text-gray-700">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>

        {/* Desktop Image */}
        <motion.img
          className="hidden w-full mb-4 rounded-lg lg:mb-0 lg:flex shadow-lg"
          src={png3}
          alt="dashboard"
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
          variants={imageVariants}
        />
      </div>
    </section>
  );
}

export default Hero3;
