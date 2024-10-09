import React, { useState, useRef } from "react";
import { motion } from "framer-motion";
import {
  FaTasks,
  FaPlus,
  FaMinus,
  FaShieldAlt,
  FaCoins,
  FaChartLine,
  FaCog,
  FaCheckCircle,
} from "react-icons/fa";
import useIntersectionObserver from "../../hooks/useIntersectionObserver"; // Adjust the import path as necessary

const services = [
  {
    groupName: "Data Integrity and Validation",
    icon: <FaShieldAlt className="text-lg text-orange-500 dark:text-orange-400 mr-6" />,
    features: ["Loan Pool", "Data Validation", "Collateral Verification", "Audit Trail"],
    iconColor: "text-orange-500 dark:text-orange-400",
    hoverColor: "hover:text-orange-500 dark:hover:text-orange-400",
  },
  {
    groupName: "Financial Reconciliation",
    icon: <FaCoins className="text-lg text-orange-500 dark:text-orange-400 mr-6" />,
    features: [
      "Cash Flow Matching",
      "Payment Reconciliation",
      "Transaction Ledger",
      "Discrepancy Resolution",
      "Interest Calculation",
      "Principal Repayment",
      "Balance Confirmation",
      "Reconciliation Statement",
    ],
    iconColor: "text-orange-500 dark:text-orange-400",
    hoverColor: "hover:text-orange-500 dark:hover:text-orange-400",
  },
  {
    groupName: "Performance Monitoring and Reporting",
    icon: <FaChartLine className="text-lg text-orange-500 dark:text-orange-400 mr-6" />,
    features: [
      "Borrower Data",
      "Loan Performance",
      "Delinquency Monitoring",
      "Receivables Tracking",
      "Financial Reporting",
      "Servicer Report",
    ],
    iconColor: "text-orange-500 dark:text-orange-400",
    hoverColor: "hover:text-orange-500 dark:hover:text-orange-400",
  },
  {
    groupName: "Processing and Operations",
    icon: <FaCog className="text-lg text-orange-500 dark:text-orange-400 mr-6" />,
    features: ["Remittance Processing", "Portfolio Reconciliation"],
    iconColor: "text-orange-500 dark:text-orange-400",
    hoverColor: "hover:text-orange-500 dark:hover:text-orange-400",
  },
];

// Fade-in animation with smoother transitions
const fadeIn = (direction = "up", delay = 0) => ({
  hidden: {
    opacity: 0,
    y: direction === "up" ? 10 : -10,
  },
  show: {
    opacity: 1,
    y: 0,
    transition: {
      delay,
      duration: 0.5, // Increased duration for smoother effect
      ease: "easeInOut",
    },
  },
});

// Parent animation variant to stagger child animations
const containerVariants = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2, // Stagger appearance of children
      delayChildren: 0.2,   // Initial delay before children animations
    },
  },
};

function PoolReconciliation() {
  const [openIndex, setOpenIndex] = useState(null);
  const containerRef = useRef(null);
  const isInView = useIntersectionObserver(containerRef, { threshold: 0.2 });

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  return (
    <div className="bg-white dark:bg-gray-900 py-12">
      <div ref={containerRef} className="max-w-2xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="text-center mb-8">
          <motion.h1
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            variants={fadeIn("up", 0.2)}
            className="flex items-center justify-center text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500"
          >
            <span className="mr-2 p-1 rounded-full border border-orange-500 flex items-center justify-center">
              <FaTasks className="text-3xl text-orange-500 dark:text-orange-400" />
            </span>
            Pool Reconciliation
          </motion.h1>
          <motion.p
            initial="hidden"
            animate={isInView ? "show" : "hidden"}
            variants={fadeIn("up", 0.4)}
            className="mt-2 text-base text-gray-600 dark:text-gray-300"
          >
            Ensuring consistency and accuracy in loan pool data.
          </motion.p>
        </div>
        <motion.div
          className="space-y-2"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "show" : "hidden"}
        >
          {services.map((service, index) => (
            <motion.div
              key={index}
              className="shadow-sm rounded-lg overflow-hidden transition-transform transform hover:scale-105 hover:shadow-lg"
              variants={fadeIn("up", 0.6 + index * 0.2)}
            >
              <button
                onClick={() => toggleAccordion(index)}
                className="w-full text-left flex items-center justify-between px-8 py-4 bg-gradient-to-r from-orange-100 to-gray-100 dark:from-gray-800 dark:to-gray-700 focus:outline-none transition-colors duration-300"
              >
                <div className="flex items-center">
                  {service.icon}
                  <h2
                    className={`text-lg font-semibold mt-4 mb-2 text-gray-900 dark:text-white cursor-pointer ${service.hoverColor}`}
                  >
                    {service.groupName}
                  </h2>
                </div>
                <span>
                  {openIndex === index ? (
                    <FaMinus className="text-lg text-orange-600" />
                  ) : (
                    <FaPlus className="text-lg text-orange-600" />
                  )}
                </span>
              </button>
              {openIndex === index && (
                <motion.div
                  initial="hidden"
                  animate="show"
                  variants={fadeIn("up", 0.8)}
                  className="p-4 bg-white dark:bg-gray-800"
                >
                  <ul className="list-none text-md text-gray-600 dark:text-gray-400 pl-6">
                    {service.features.map((feature, featureIdx) => (
                      <motion.li
                        key={featureIdx}
                        initial="hidden"
                        animate="show"
                        variants={fadeIn("up", 1 + featureIdx * 0.1)}
                        className="flex items-center mb-2"
                      >
                        <FaCheckCircle className={`mr-4 ${service.iconColor}`} />
                        {feature}
                      </motion.li>
                    ))}
                  </ul>
                </motion.div>
              )}
            </motion.div>
          ))}
        </motion.div>
      </div>
    </div>
  );
}

export default PoolReconciliation;