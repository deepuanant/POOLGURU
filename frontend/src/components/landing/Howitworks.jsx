import React, { useRef } from "react";
import { Link } from "react-router-dom";
import { FiArrowRight } from "react-icons/fi";
import { motion } from "framer-motion";
import { FaUserPlus, FaTools, FaChartLine } from "react-icons/fa";
import { fadeIn } from "../common/FadeIn";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

function HowItWorks() {
  const sectionRef = useRef(null);
  
  // Refs for individual items
  const createAccountRef = useRef(null);
  const customizeToolsRef = useRef(null);
  const monitorProgressRef = useRef(null);

  // Determine if the viewport is mobile
  const isMobile = window.innerWidth <= 640; // Adjust this breakpoint as needed

  // Intersection observers for individual items
  const isCreateAccountInView = useIntersectionObserver(createAccountRef, {
    threshold: isMobile ? 0.5 : 0.1,
  });
  const isCustomizeToolsInView = useIntersectionObserver(customizeToolsRef, {
    threshold: isMobile ? 0.5 : 0.1,
  });
  const isMonitorProgressInView = useIntersectionObserver(monitorProgressRef, {
    threshold: isMobile ? 0.5 : 0.1,
  });

  // Unified animation condition
  const isAnyInView = isCreateAccountInView || isCustomizeToolsInView || isMonitorProgressInView;

  return (
    <div>
      <div className="pt-10">
        <section className="py-12 bg-white">
          <div className="container mx-auto px-6">
            <div className="text-center mb-8">
              <motion.h2
                ref={sectionRef}
                initial="hidden"
                animate={isAnyInView ? "show" : "hidden"}
                variants={fadeIn("up", 0.2)}
                className="mb-4 text-4xl font-extrabold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500"
              >
                How it Works
              </motion.h2>
              <motion.h3
                initial="hidden"
                animate={isAnyInView ? "show" : "hidden"}
                variants={fadeIn("up", 0.4)}
                className="mb-2 text-2xl font-semibold text-grey-600"
              >
                A Step-by-Step Guide to Our Platform
              </motion.h3>
              <motion.p
                initial="hidden"
                animate={isAnyInView ? "show" : "hidden"}
                variants={fadeIn("up", 0.6)}
                className="text-gray-600 mb-8"
              >
                Discover the simplicity of our platform: Sign up, choose <br />
                your service, and seamlessly operate the specialized tools.
              </motion.p>
            </div>
            <div className="relative flex flex-wrap justify-between items-center">
              {[
                {
                  ref: createAccountRef,
                  inView: isCreateAccountInView,
                  icon: <FaUserPlus className="text-4xl text-orange-500" />,
                  title: "Create An Account",
                  description:
                    "Join our platform effortlessly! Streamlined user registration with secure verification.",
                  delay: 0.2,
                },
                {
                  ref: customizeToolsRef,
                  inView: isCustomizeToolsInView,
                  icon: <FaTools className="text-4xl text-orange-500" />,
                  title: "Customize Your Tools",
                  description:
                    "Select and configure the tools you need to streamline your securitization processes.",
                  delay: 0.4,
                },
                {
                  ref: monitorProgressRef,
                  inView: isMonitorProgressInView,
                  icon: <FaChartLine className="text-4xl text-orange-500" />,
                  title: "Monitor Your Progress",
                  description:
                    "Track and analyze your data with our powerful monitoring tools.",
                  delay: 0.6,
                },
              ].map((item, index) => (
                <motion.div
                  key={index}
                  ref={item.ref}
                  initial="hidden"
                  animate={item.inView ? "show" : "hidden"}
                  variants={fadeIn("up", item.delay)}
                  className="w-full sm:w-1/3 flex flex-col items-center mb-8 sm:mb-0"
                >
                  <div className="bg-white p-4 rounded-full shadow-lg">
                    {item.icon}
                  </div>
                  <h4 className="mt-4 mb-2 text-xl font-bold text-gray-700">
                    {item.title}
                  </h4>
                  <p className="text-gray-600 text-center">{item.description}</p>
                </motion.div>
              ))}
            </div>
            <motion.div
              initial="hidden"
              animate={isAnyInView ? "show" : "hidden"}
              variants={fadeIn("up", 0.8)}
              className="flex justify-center mt-8"
            >
              <Link
                to="/signup"
                className="flex items-center justify-center text-white bg-gradient-to-r from-orange-500 to-yellow-500 border-2 rounded-lg px-4 py-2 font-medium text-base dark:text-orange-400 dark:hover:text-orange-500  duration-300 cursor-pointer transition-transform transform hover:scale-105"
                >
                <span className="mr-2">Get Started</span>
                <FiArrowRight />
              </Link>
            </motion.div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default HowItWorks;
