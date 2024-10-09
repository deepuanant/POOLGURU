import React, { useRef } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../common/FadeIn";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import {
  FaCubes,
  FaMoneyBillWave,
  FaChartLine,
  FaBuilding,
  FaCertificate,
} from "react-icons/fa";

const PassThroughCertificate = () => {
  const headerRef = useRef(null);
  const sectionRef = useRef(null);
  const isHeaderVisible = useIntersectionObserver(headerRef, {
    threshold: 0.1,
  });
  const isSectionVisible = useIntersectionObserver(sectionRef, {
    threshold: 0.1,
  });

  return (
    <div className="bg-white px-4 py-8 ">
      <div className="max-w-full mx-auto px-4">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 items-center">
          <div ref={headerRef} className="lg:col-span-1 text-center">
            <motion.h1
              initial="hidden"
              animate={isHeaderVisible ? "show" : "hidden"}
              variants={fadeIn("up", 0.2)}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="flex items-center justify-center text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500"
            >
              <span className="mr-3 p-1 rounded-full border border-orange-500 flex items-center justify-center">
                <FaCertificate className="text-3xl text-orange-500 dark:text-orange-400" />
              </span>
              Pass-Through Certificates
            </motion.h1>
            <motion.p
              initial="hidden"
              animate={isHeaderVisible ? "show" : "hidden"}
              variants={fadeIn("up", 0.4)}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="text-lg text-center mb-8 text-gray-700"
            >
              Explore Asset-Backed Securities, Mortgage-Backed Securities, and
              more, designed to optimize your investment strategies.
            </motion.p>
          </div>

          {/* Cards Section */}
          <div
            ref={sectionRef}
            className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-6"
          >
            {[
              {
                icon: <FaCubes size={32} className="text-orange-500 mb-4" />,
                title: "Asset Structure",
                description:
                  "Including Asset-Backed and Mortgage-Backed Securities, SPV, and more.",
              },
              {
                icon: (
                  <FaMoneyBillWave
                    size={32}
                    className="text-yellow-500 mb-4"
                  />
                ),
                title: "Financial Mechanisms",
                description:
                  "Manage Principal, Interest, Cash Flow, and Investor Yield.",
              },
              {
                icon: (
                  <FaChartLine size={32} className="text-orange-600 mb-4" />
                ),
                title: "Market and Issuance",
                description:
                  "Security Issuance, Tranche, and Secondary Market operations.",
              },
              {
                icon: (
                  <FaBuilding size={32} className="text-yellow-600 mb-4" />
                ),
                title: "Roles and Entities",
                description:
                  "Engage with Loan Originators, Servicers, and other key players.",
              },
            ].map((item, index) => (
              <motion.div
                key={index}
                className="bg-white p-6 rounded-lg shadow-lg flex flex-col items-center justify-center text-center transition-transform transform hover:scale-105 hover:shadow-lg"
                initial="hidden"
                animate={isSectionVisible ? "show" : "hidden"}
                transition={{ duration: 0.5, ease: "easeInOut" }}
              >
                {item.icon}
                <h2 className="text-xl font-semibold mb-2 hover:text-orange-600 cursor-pointer">
                  {item.title}
                </h2>
                <p className="text-gray-700">{item.description}</p>
              </motion.div>
            ))}
          </div>
        </div>
      </div>
    </div>
  );
};

export default PassThroughCertificate;
