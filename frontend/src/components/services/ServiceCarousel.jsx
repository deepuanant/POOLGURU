import React, { useRef } from "react";
import { motion } from "framer-motion";
import Slider from "react-slick";
import "slick-carousel/slick/slick.css";
import "slick-carousel/slick/slick-theme.css";
import {
  FaCogs,
  FaDollarSign,
  FaChartLine,
  FaTasks,
  FaHandshake,
  FaBuilding,
  FaCertificate,
} from "react-icons/fa";
import { fadeIn } from "../common/FadeIn";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

const services = [
  {
    title: "Pool Scrubbing",
    description: "Ensuring data integrity and compliance for your loan portfolios.",
    icon: <FaCogs className="text-3xl text-orange-500 dark:text-orange-400 common-icon" />,
  },
  {
    title: "Payout Monitoring",
    description: "Tracking cash flows and ensuring accurate payment schedules.",
    icon: <FaDollarSign className="text-3xl text-orange-500 dark:text-orange-400 common-icon" />,
  },
  {
    title: "Loss Estimation",
    description: "Assessing potential losses and managing credit risk.",
    icon: <FaChartLine className="text-3xl text-orange-500 dark:text-orange-400 common-icon" />,
  },
  {
    title: "Pool Reconciliation",
    description: "Ensuring consistency and accuracy in loan pool data.",
    icon: <FaTasks className="text-3xl text-orange-500 dark:text-orange-400 common-icon" />,
  },
  {
    title: "Direct Assignment",
    description: "Facilitating loan transfers and asset sales.",
    icon: <FaHandshake className="text-3xl text-orange-500 dark:text-orange-400 common-icon" />,
  },
  {
    title: "Co lending",
    description: "Collaborative lending solutions for diversified portfolios.",
    icon: <FaBuilding className="text-3xl text-orange-500 dark:text-orange-400 common-icon" />,
  },
  {
    title: "Pass-Through Certificate",
    description: "Creating asset-backed securities for diversified investment options.",
    icon: <FaCertificate className="text-3xl text-orange-500 dark:text-orange-400 common-icon" />,
  },
];

function ServiceCarousel({ serviceRefs }) {
  const ref = useRef(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.1 });

  const settings = {
    dots: true,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2500,
    pauseOnHover: false,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: true,
          autoplay: true,
          autoplaySpeed: 2500,
          pauseOnHover: false,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          autoplay: true,
          autoplaySpeed: 2500,
          pauseOnHover: false,
        },
      },
    ],
  };

  const handleTitleClick = (title) => {
    const ref = serviceRefs[title];
    if (ref && ref.current) {
      ref.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  };

  return (
    <div ref={ref}>
      <section className="p-8 bg-gradient-to-r from-orange-100 to-gray-100 dark:from-gray-900 dark:to-gray-700">
        <div className="max-w-screen-xl mx-auto px-6">
          <div className="text-center mb-4">
            <motion.h3
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              variants={fadeIn("up", 0.2)}
              className="mb-2 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-orange-400 dark:to-yellow-400"
            >
              Our Services
            </motion.h3>
            <motion.p
              initial="hidden"
              animate={isInView ? "show" : "hidden"}
              variants={fadeIn("up", 0.4)}
              transition={{ duration: 0.5, ease: "easeInOut" }}
              className="text-gray-700 mb-4 text-lg"
            >
              Streamline your operations with our comprehensive services.
            </motion.p>
          </div>
         <Slider {...settings} key={Date.now()}>
  {services.map((service, index) => (
    <motion.div
      key={index}
      className="p-4"
      initial="hidden"
      animate={isInView ? "show" : "hidden"}
      variants={fadeIn("up", 0.2 + index * 0.2)}
      transition={{ duration: 0.5, ease: "easeInOut" }}
    >
      <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-4 text-center h-56 flex flex-col justify-evenly transition-transform transform hover:scale-105 hover:shadow-lg">
        {/* Icon */}
        <div className="flex justify-center mb-2">{service.icon}</div>

        {/* Title */}
        <h4
          className="text-xl font-semibold text-gray-900 dark:text-white  cursor-pointer hover:text-orange-500"
          onClick={() => handleTitleClick(service.title)}
        >
          {service.title}
        </h4>

        {/* Description with truncation */}
        <p className="text-gray-500 dark:text-gray-400 overflow-hidden text-ellipsis line-clamp-3">
          {service.description}
        </p>
      </div>
    </motion.div>
  ))}
</Slider>

        </div>
      </section>
    </div>
  );
}

export default ServiceCarousel;
