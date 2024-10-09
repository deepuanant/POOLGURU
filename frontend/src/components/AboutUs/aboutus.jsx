import React, { useRef } from "react";
import { motion } from "framer-motion";
import img1 from "./contemporary-design-concept_11zon.webp";
import { FaEye, FaBullseye, FaLightbulb } from "react-icons/fa";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import { fadeIn } from "../common/FadeIn";

const AboutUs = () => {
  const refHeading = useRef(null);
  const refParagraph = useRef(null);
  const refImage = useRef(null);
  const refVision = useRef(null);
  const refMission = useRef(null);
  const refApproach = useRef(null);

  // Intersection observers
  const isHeadingInView = useIntersectionObserver(refHeading, {
    threshold: 0.2,
  });
  const isParagraphInView = useIntersectionObserver(refParagraph, {
    threshold: 0.2,
  });
  const isImageInView = useIntersectionObserver(refImage, { threshold: 0.2 });
  const isVisionInView = useIntersectionObserver(refVision, { threshold: 0.2 });
  const isMissionInView = useIntersectionObserver(refMission, {
    threshold: 0.2,
  });
  const isApproachInView = useIntersectionObserver(refApproach, {
    threshold: 0.2,
  });

  return (
    <div className="py-16 bg-gradient-to-r from-orange-100 to-gray-100 dark:from-gray-900 dark:to-gray-700">
      <div className="container relative flex flex-col items-center px-4 mx-auto mb-20 lg:px-12 lg:flex-row lg:items-start lg:justify-between">
        <motion.div
          ref={refHeading}
          initial="hidden"
          animate={isHeadingInView ? "show" : "hidden"}
          variants={fadeIn("up", 0.2)}
          className="z-10 w-full text-center lg:w-1/2 lg:max-w-lg lg:text-left"
        >
          <h3 className="mb-4 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-orange-400 dark:to-yellow-400">
            About Us
          </h3>
          <motion.p
            ref={refParagraph}
            initial="hidden"
            animate={isParagraphInView ? "show" : "hidden"}
            variants={fadeIn("up", 0.4)}
            className="mb-4 text-lg text-justify text-gray-700 dark:text-slate-300"
          >
            At the heart of our organization lies a group of forward-thinking
            professionals who are not only passionate about finance but also
            about harnessing the power of technology to deliver unparalleled
            solutions. Our team is composed of highly skilled Chartered
            Accountants with a keen interest in leveraging data analytics,
            automation, and digital tools to enhance financial processes and
            outcomes.
          </motion.p>
        </motion.div>
        <motion.div
          ref={refImage}
          initial={{ opacity: 0, scale: 0.8 }}
          animate={
            isImageInView
              ? { opacity: 1, scale: 1 }
              : { opacity: 0, scale: 0.8 }
          }
          transition={{ duration: 0.8, ease: "easeOut" }}
          className="w-[600px] h-[350px] bg-cover bg-left rounded-md shadow-2xl hidden lg:block lg:-ml-6"
          style={{
            backgroundImage: `url(${img1})`,
            borderRadius: "50% 50% 30% 70% / 40% 40% 60% 60%",
            position: "absolute",
            top: "0",
            right: "40px",
          }}
        ></motion.div>
      </div>

      {/* Vision, Mission, Approach Section */}
      <div className="container grid grid-cols-1 gap-8 px-8 mx-auto text-center mt-28 lg:px-20 sm:grid-cols-2 lg:grid-cols-3">
        <motion.div
          ref={refVision}
          initial="hidden"
          animate={isVisionInView ? "show" : "hidden"}
          transition={{ delay: 0.2 }}
          className="flex flex-col items-center p-8 transition-transform transform bg-white rounded-lg shadow-lg dark:bg-gray-800 hover:scale-105 hover:shadow-xl"
        >
          <div className="p-4 mb-4 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500">
            <FaEye className="text-2xl text-white" />
          </div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Our Vision
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We envision a future where financial services are seamlessly
            integrated, highly efficient, and remarkably accurate. By combining
            our financial acumen with technological advancements, we aim to set
            new benchmarks in the industry, ensuring that our clients always
            stay ahead of the curve.
          </p>
        </motion.div>

        <motion.div
          ref={refMission}
          initial="hidden"
          animate={isMissionInView ? "show" : "hidden"}
          transition={{ delay: 0.4 }}
          className="flex flex-col items-center p-8 transition-transform transform bg-white rounded-lg shadow-lg dark:bg-gray-800 hover:scale-105 hover:shadow-xl"
        >
          <div className="p-4 mb-4 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500">
            <FaBullseye className="text-2xl text-white" />
          </div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Our Mission
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            Our mission is to provide Banks and NBFCs with robust, reliable, and
            innovative financial solutions. We are committed to helping our
            clients achieve their financial goals by offering services that are
            not only comprehensive but also tailored to meet their specific
            needs.
          </p>
        </motion.div>

        <motion.div
          ref={refApproach}
          initial="hidden"
          animate={isApproachInView ? "show" : "hidden"}
          transition={{ delay: 0.6 }}
          className="flex flex-col items-center p-8 transition-transform transform bg-white rounded-lg shadow-lg dark:bg-gray-800 hover:scale-105 hover:shadow-xl"
        >
          <div className="p-4 mb-4 rounded-full bg-gradient-to-r from-orange-500 to-yellow-500">
            <FaLightbulb className="text-2xl text-white" />
          </div>
          <h2 className="mb-4 text-xl font-semibold text-gray-900 dark:text-white">
            Our Approach
          </h2>
          <p className="text-gray-700 dark:text-gray-300">
            We take a holistic approach to financial services, integrating
            advanced technologies with traditional financial expertise. This
            unique blend allows us to offer solutions that are both innovative
            and practical, ensuring our clients benefit from the best of both
            worlds.
          </p>
        </motion.div>
      </div>
    </div>
  );
};

export default AboutUs;
