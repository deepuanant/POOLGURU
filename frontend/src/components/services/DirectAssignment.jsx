import React, { useRef, useEffect, useState } from "react";
import { motion } from "framer-motion";
import useIntersectionObserver from "../../hooks/useIntersectionObserver"; // Adjust import path as necessary
import {
  FaHandshake,
  FaChartLine,
  FaBuilding,
  FaCogs,
  FaCheckCircle,
} from "react-icons/fa";

const services = [
  {
    title: "Loan Management",
    icon: (
      <FaHandshake className="text-3xl text-orange-500 dark:text-orange-400 mr-2" />
    ),
    color: "text-orange-500",
    hoverColor: "hover:text-orange-500",
    features: [
      "Loan Transfer",
      "Mortgage Transfer",
      "Securitization",
      "Debt Instrument",
    ],
  },
  {
    title: "Financial Management",
    icon: <FaChartLine className="text-3xl text-yellow-400 mr-2" />,
    color: "text-yellow-400",
    hoverColor: "hover:text-yellow-400",
    features: ["Credit Risk", "Risk Management", "Credit Enhancement", "NPA's"],
  },
  {
    title: "Structural Elements",
    icon: <FaBuilding className="text-3xl text-yellow-600 mr-2" />,
    color: "text-yellow-600",
    hoverColor: "hover:text-yellow-600",
    features: ["SPV", "Financial Institution", "Structured Finance"],
  },
  {
    title: "Loan Operations",
    icon: (
      <FaCogs className="text-3xl text-yellow-500 dark:text-yellow-400 mr-2" />
    ),
    color: "text-yellow-500",
    hoverColor: "hover:text-yellow-500",
    features: [
      "Loan Origination",
      "Loan Servicing",
      "Portfolio Management",
      "Underwriting",
    ],
  },
];

const fadeInUp = (delay = 0) => ({
  hidden: { opacity: 0, y: 20, scale: 0.95 },
  show: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: { delay, duration: 0.5, ease: "easeInOut" },
  },
});

function DirectAssignment() {
  const refs = useRef([]);
  const [isVisible, setIsVisible] = useState(
    Array(services.length).fill(false)
  );
  const [headingVisible, setHeadingVisible] = useState(false);
  const [paragraphVisible, setParagraphVisible] = useState(false);

  useEffect(() => {
    refs.current.forEach((ref, index) => {
      const observer = new IntersectionObserver(
        ([entry]) => {
          setIsVisible((prev) => {
            const updated = [...prev];
            updated[index] = entry.isIntersecting;
            return updated;
          });
        },
        { threshold: 0.1 }
      );

      if (ref) observer.observe(ref);

      return () => {
        if (ref) observer.unobserve(ref);
      };
    });
  }, [refs]);

  const headingRef = useRef(null);
  const paragraphRef = useRef(null);

  const isHeadingVisible = useIntersectionObserver(headingRef, {
    threshold: 0.1,
  });
  const isParagraphVisible = useIntersectionObserver(paragraphRef, {
    threshold: 0.1,
  });

  useEffect(() => {
    setHeadingVisible(isHeadingVisible);
    setParagraphVisible(isParagraphVisible);
  }, [isHeadingVisible, isParagraphVisible]);

  return (
    <div className="bg-white py-12 mt-4">
      <div className="max-w-7xl mx-auto px-4 lg:px-6">
        <div className="flex flex-col lg:flex-row-reverse lg:items-center gap-6">
          {/* Right side: Main heading */}
          <div className="lg:w-1/3 text-center lg:text-right ml-10 ">
            <motion.h1
              ref={headingRef}
              initial="hidden"
              animate={headingVisible ? "show" : "hidden"}
              variants={fadeInUp(0)}
              className="flex items-center justify-center lg:justify-start text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500"
            >
              <span className="mr-3 p-1 rounded-full border border-orange-500 flex items-center justify-center">
                <FaHandshake className="text-4xl text-orange-500 dark:text-orange-400" />
              </span>
              Direct Assignment
            </motion.h1>
            <motion.p
              ref={paragraphRef}
              initial="hidden"
              animate={paragraphVisible ? "show" : "hidden"}
              variants={fadeInUp(0.2)}
              className="text-lg text-center lg:text-left mb-8 text-gray-700"
            >
              Facilitating loan transfers and asset sales.
            </motion.p>
          </div>
          <div className="lg:w-2/3 grid grid-cols-1 sm:grid-cols-2 gap-6">
            {services.map((service, index) => (
              <motion.div
                key={index}
                ref={(el) => (refs.current[index] = el)}
                className="relative p-6 bg-white shadow-lg rounded-lg transition-transform transform hover:scale-105 hover:shadow-lg"
                initial="hidden"
                animate={isVisible[index] ? "show" : "hidden"}
              >
                <div className="flex items-center mb-3">
                  {service.icon}
                  <h2
                    className={`text-lg font-semibold text-gray-900 cursor-pointer ${service.hoverColor}`}
                  >
                    {service.title}
                  </h2>
                </div>
                <ul className="space-y-2 text-gray-700 text-sm">
                  {service.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-center">
                      <FaCheckCircle className={`${service.color} mr-2`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
}

export default DirectAssignment;
