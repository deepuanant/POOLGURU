import React, { useRef, useState, useEffect } from "react";
import { motion } from "framer-motion";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import {
  FaDollarSign,
  FaExclamationTriangle,
  FaClipboardList,
  FaSyncAlt,
  FaCheckCircle,
} from "react-icons/fa";

const services = [
  {
    title: "Risk Assessment",
    icon: (
      <FaExclamationTriangle className="text-3xl text-orange-500 dark:text-orange-400" />
    ),
    features: [
      "Default Probability",
      "Expected Loss",
      "Scenario Analysis",
      "Delinquency Rates",
    ],
    iconColor: "text-orange-500 dark:text-orange-400",
    hoverColor: "hover:text-orange-500 dark:hover:text-orange-400",
  },
  {
    title: "Recovery and Mitigation",
    icon: (
      <FaClipboardList className="text-3xl text-yellow-500" />
    ),
    features: [
      "Loss Given Default",
      "Recovery Rate",
      "Collateral Valuation",
      "Loan-to-Value Ratio",
    ],
    iconColor: "text-yellow-500",
    hoverColor: "hover:text-yellow-500",
  },
  {
    title: "Portfolio Management",
    icon: (
      <FaSyncAlt className="text-3xl text-yellow-700" />
    ),
    features: [
      "Loan Performance",
      "Portfolio Analysis",
      "Loan Loss Provisioning",
      "Reserve Requirements",
    ],
    iconColor: "text-yellow-700",
    hoverColor: "hover:text-yellow-700",
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

function LossEstimation() {
  const refs = useRef([]);
  const [isVisible, setIsVisible] = useState(Array(services.length).fill(false));

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
  }, []);

  const headingRef = useRef(null);
  const paragraphRef = useRef(null);

  const isHeadingVisible = useIntersectionObserver(headingRef, { threshold: 0.1 });
  const isParagraphVisible = useIntersectionObserver(paragraphRef, { threshold: 0.1 });

  return (
    <div className="bg-gradient-to-r from-orange-100 to-gray-100 dark:from-orange-200 dark:to-gray-200 text-gray-900 p-8">
      <div className="max-w-screen-xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-6">
          <motion.h1
            ref={headingRef}
            initial="hidden"
            animate={isHeadingVisible ? "show" : "hidden"}
            variants={fadeInUp(0)}
            className="flex items-center justify-center text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500"
          >
            <span className="mr-3 p-1 rounded-full border border-orange-500 flex items-center justify-center">
              <FaDollarSign className="text-4xl text-orange-500 dark:text-orange-400" />
            </span>
            Loss Estimation
          </motion.h1>
          <motion.p
            ref={paragraphRef}
            initial="hidden"
            animate={isParagraphVisible ? "show" : "hidden"}
            variants={fadeInUp(0.2)}
            className="mt-4 text-lg text-gray-600 dark:text-gray-300"
          >
            Assessing potential losses and managing credit risk.
          </motion.p>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {services.map((service, index) => (
            <motion.div
              key={index}
              ref={(el) => (refs.current[index] = el)}
              className="w-full p-4 text-center"
              initial="hidden"
              animate={isVisible[index] ? "show" : "hidden"}
              variants={fadeInUp(index * 0.2)}
            >
              <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-lg h-full flex flex-col items-center min-h-[300px] transition-transform transform hover:scale-105 hover:shadow-lg">
                <div className="p-3">
                  {service.icon}
                </div>
                <h2
                  className={`text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-white cursor-pointer ${service.hoverColor}`}
                >
                  {service.title}
                </h2>
                <ul className="mt-4 text-left list-none text-gray-600 dark:text-gray-400">
                  {service.features.map((feature, featureIdx) => (
                    <li key={featureIdx} className="flex items-center mb-2">
                      <FaCheckCircle className={`mr-2 ${service.iconColor}`} />
                      {feature}
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LossEstimation;
