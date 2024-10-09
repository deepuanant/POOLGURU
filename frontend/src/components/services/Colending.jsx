import React, { useRef } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../common/FadeIn";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import {
  FaUserFriends,
  FaRegMoneyBillAlt,
  FaBalanceScale,
  FaChartPie,
  FaBuilding,
} from "react-icons/fa";

const CoLending = () => {
  const sectionRef = useRef(null);
  const isVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 });

  const services = [
    {
      title: "Lending Partnership",
      tagline:
        "Unlock the power of Joint Lending, backed by robust Loan Syndication, effective Underwriting Collaboration, and a streamlined Co-origination Model.",
      icon: FaUserFriends,
    },
    {
      title: "Loan Operations",
      tagline:
        "Experience smooth Loan Disbursement and efficient Loan Servicing through customized Loan Agreements tailored to your unique requirements.",
      icon: FaRegMoneyBillAlt,
    },
    {
      title: "Credit Policy",
      tagline:
        "Achieve excellence in Credit Co-origination with thorough Credit Assessment and ensure seamless Credit Policy Alignment across all transactions.",
      icon: FaBalanceScale,
    },
    {
      title: "Diversification",
      tagline:
        "Optimize your financial approach with Interest Rate Sharing, strategic Portfolio Diversification and precise Borrower Segmentation.",
      icon: FaChartPie,
    },
  ];

  return (
    <div className="bg-gradient-to-r from-orange-100 to-gray-100 dark:from-gray-900 dark:to-gray-700 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-screen-xl mx-auto px-2 text-center">
        {/* Separate Motion for h1 and p */}
        <motion.h1
          ref={sectionRef}
          initial="hidden"
          animate={isVisible ? "show" : "hidden"}
          variants={fadeIn("up", 0.2)}
          className="flex items-center justify-center text-2xl font-bold mb-2 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500"
        >
          <span className="mr-3 p-1 rounded-full border border-orange-500 flex items-center justify-center">
            <FaBuilding className="text-4xl text-orange-500 dark:text-orange-400" />
          </span>
          Co Lending
        </motion.h1>

        <motion.p
          initial="hidden"
          animate={isVisible ? "show" : "hidden"}
          variants={fadeIn("up", 0.4)} // Different delay for separate animation
          className="text-lg text-center mb-16 text-gray-700"
        >
          Collaborative lending solutions for diversified portfolios.
        </motion.p>

        <div className="flex flex-wrap justify-center items-center mb-10">
          {services.map((service, index) => (
            <div
              key={index}
              className="relative bg-white dark:bg-gray-800 p-6 w-64 h-64 m-4 transform rotate-45 shadow-lg transition-transform transform hover:scale-105 hover:shadow-lg"
            >
              <div className="transform -rotate-45 text-center flex flex-col justify-start items-center h-full">
                <service.icon
                  size={40}
                  className="text-orange-500 dark:text-yellow-500 mb-4"
                />
                <h2 className="text-xl font-semibold text-gray-900 dark:text-white mb-2 hover:text-orange-600 cursor-pointer">
                  {service.title}
                </h2>
                <p className="text-gray-700 dark:text-gray-300 text-sm max-w-xs">
                  {service.tagline}
                </p>
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CoLending;
