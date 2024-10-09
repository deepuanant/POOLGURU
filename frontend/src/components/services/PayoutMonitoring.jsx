import React, { useRef } from "react";
import { motion } from "framer-motion";
import { fadeIn } from "../common/FadeIn";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import {
  FaDollarSign,
  FaRegClock,
  FaFileInvoiceDollar,
  FaClipboardCheck,
} from "react-icons/fa";

const PayoutMonitoring = () => {
  const headerRef = useRef(null);
  const sectionRef = useRef(null);
  const isHeaderVisible = useIntersectionObserver(headerRef, { threshold: 0.1 });
  const isSectionVisible = useIntersectionObserver(sectionRef, { threshold: 0.1 });

  return (
    <div className="bg-gradient-to-r from-orange-100 to-gray-100 dark:from-orange-200 dark:to-gray-200 text-gray-900 p-8">
      <div className="max-w-7xl mx-auto">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8 items-center">
          <div ref={headerRef} className="lg:col-span-1 text-center">
            <motion.h1
              initial="hidden"
              animate={isHeaderVisible ? "show" : "hidden"}
              variants={fadeIn("up", 0.2)}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="flex items-center justify-center text-2xl font-bold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500"
            >
              <span className="mr-3 p-1 rounded-full border border-orange-500 flex items-center justify-center">
                <FaDollarSign className="text-4xl text-orange-500 dark:text-orange-400" />
              </span>
              Payout Monitoring
            </motion.h1>
            <motion.p
              initial="hidden"
              animate={isHeaderVisible ? "show" : "hidden"}
              variants={fadeIn("up", 0.4)}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="text-lg text-center mb-8 text-gray-700"
            >
              Tracking performance and maintaining precision across your financial portfolios.
            </motion.p>
          </div>

          {/* Cards Section */}
          <div
            ref={sectionRef}
            className="lg:col-span-2 grid grid-cols-1 sm:grid-cols-2 gap-8"
          >
            {[
              {
                icon: <FaDollarSign size={32} className="text-orange-500 mb-4" />,
                title: "Cash Flow Management",
                description: "Manage your cash flow with precision, ensuring smooth financial operations.",
              },
              {
                icon: <FaRegClock size={32} className="text-yellow-500 mb-4" />,
                title: "Payment Reconciliation",
                description: "Accurate reconciliation of payments for transparency and reliability.",
              },
              {
                icon: <FaFileInvoiceDollar size={32} className="text-orange-600 mb-4" />,
                title: "Loan Servicing & Monitoring",
                description: "Comprehensive monitoring and servicing for loan operations.",
              },
              {
                icon: <FaClipboardCheck size={32} className="text-yellow-600 mb-4" />,
                title: "Reporting & Compliance",
                description: "Stay compliant and informed with our detailed reporting services.",
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

export default PayoutMonitoring;
