import React, { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import png4 from "../../assets/hero2.svg";
import { fadeIn } from "../common/FadeIn";

function useIntersectionObserver(ref, options) {
  const [isIntersecting, setIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(([entry]) => {
      setIntersecting(entry.isIntersecting);
    }, options);

    const currentRef = ref.current;

    if (currentRef) {
      observer.observe(currentRef);
    }

    return () => {
      if (currentRef) {
        observer.unobserve(currentRef);
      }
    };
  }, [ref, options]);

  return isIntersecting;
}

function Hero2() {
  const ref = useRef(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.1 });

  return (
    <section className="bg-white dark:bg-gray-900">
      <div className="flex flex-col lg:grid lg:grid-cols-2 items-center gap-8 xl:gap-12 max-w-screen-xl px-4 py-4 mx-auto space-y-10 lg:space-y-0 lg:py-12 lg:px-6">

        {/* Image Section */}
        <motion.img
          className="w-full rounded-lg shadow-lg order-1 lg:order-1" // Changed to keep image on left
          src={png4}
          alt="feature"
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
          className="text-gray-500 sm:text-lg dark:text-gray-400 order-2 lg:order-2" // Updated to ensure text is on the right
        >
          <motion.h2
            className="mb-4 text-3xl font-extrabold tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500"
          >
            Streamlining Your Loan Portfolio
          </motion.h2>
          <motion.p
            variants={fadeIn("up", 0.4)}
            transition={{ duration: 0.5, ease: "easeInOut" }} // Improved transition
            className="mb-4 text-gray-600 lg:text-xl"
          >
            Comprehensive solutions for managing your loan portfolio, from data
            cleansing to loss estimation and beyond.
          </motion.p>
          <ul className="pt-8 space-y-5 border-t border-gray-200 my-7 dark:border-gray-700">
            {[
              "Mitigate Credit Risks",
              "Ensure Data Integrity",
              "Risk and Loss Estimation",
              "Optimize Cash Flow Performance",
              "Compliance and Regulatory Adherence",
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
                <span className="text-base font-medium leading-tight text-gray-600">
                  {item}
                </span>
              </li>
            ))}
          </ul>
        </motion.div>
      </div>
    </section>
  );
}

export default Hero2;
