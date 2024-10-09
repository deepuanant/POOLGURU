import React, { useRef } from "react";
import { motion } from "framer-motion";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";
import { fadeIn, scaleUp } from "../common/FadeIn";

import img1 from "./city-lights-urban-scenic-view-buildings-concept_11zon.webp";
import MohitShahImage from "../OurTeams/MohitShah_11zon.webp";
import ShankarSinghImage from "../OurTeams/ShankarSingh_11zon.webp";
import SachinPathakImage from "../OurTeams/SachinPathak_11zon.webp";
import DeepakTiwariImage from "../OurTeams/DeepakTiwari_11zon.webp";

const teamMembers = [
  {
    name: "Mohit Shah",
    title: "FCA",
    imageUrl: MohitShahImage,
    description:
      "CA Mohit Shah is a distinguished leader and a proud graduate of Jai Hind College, Mumbai, where he completed his education in 2009. With over a decade of post-qualification professional practice experience, Mohit specializes in IPOs, start-up funding, investor relations, debt syndication, project finance, loan restructuring, and insolvency & bankruptcy code (IBC) matters. Additionally, he is well-versed in ERP, SOP development, and SEBI compliances. His deep understanding of the financial landscape enables him to deliver comprehensive solutions tailored to the unique needs of businesses. Mohit's leadership and dedication have been instrumental in transforming Treyst into a hub of excellence.",
  },
  {
    name: "Shankar Singh",
    title: "ACA, FAFD",
    imageUrl: ShankarSinghImage,
    description:
      "CA Shankar Singh is a dynamic leader specializing in Banking and NBFC Audits. He graduated from Jai Narayan Vyas University, Jodhpur, in 2015. With more than 7 years of post-qualification professional practice experience, Shankar has and extensive experience in securitization, forensic audits, agency for special monitoring. Shankar's exceptional work quality in the banking industry is reflected in his strong reputation and goodwill across all banking channels. His dedication and expertise ensure that our clients receive the highest standards of service and support in the complex and ever-evolving banking sector.",
  },
  {
    name: "Sachin Pathak",
    title: "CIA, CISA",
    imageUrl: SachinPathakImage,
    description:
      "Sachin Pathak is a seasoned finance and audit professional with over 24 years of rich experience in internal controls, enterprise risk management, and compliance. A Chartered Accountant, Certified Internal Auditor, and Certified Information System Auditor, Sachin has consistently excelled in designing risk assessment frameworks, enhancing corporate governance standards, and implementing comprehensive internal audit programs. Throughout his career, Sachin has successfully managed key leadership roles across various industries, contributing to significant cost reductions, process improvements, and enhanced financial transparency. His expertise in Sarbanes-Oxley (SOX) compliance, forensic audits, and management consulting has made him a trusted advisor in rapidly changing environments.",
  },
  {
    name: "Deepak Tiwari",
    title: "Co-Founder",
    imageUrl: DeepakTiwariImage,
    description:
      "Deepak Tiwari is a seasoned professional with over 18 years of experience in operations and business development. A graduate of Mumbai University with a Master’s in Management Studies, Deepak's expertise spans across various domains. Throughout his career, he has consistently demonstrated a strong ability to analyze market trends, develop strategic initiatives, and drive revenue growth. His leadership and dedication have been pivotal in transforming business operations and ensuring that clients receive the highest standards of service and support. As the brainchild behind Treyst, Deepak continues to be a valuable asset in the technical and development space.",
  },
];

const TeamMemberSection = ({ member, index }) => {
  const sectionRef = useRef(null);
  const isVisible = useIntersectionObserver(sectionRef, {
    threshold: 0.5,
    triggerOnce: false,
  });

  return (
    <section
      ref={sectionRef}
      className={`w-full min-h-xl py-10 md:py-12 m-auto flex justify-content-center ${
        index % 2 === 0
          ? "bg-gradient-to-r from-orange-100 to-gray-100"
          : "bg-white"
      }`}
    >
      <div className="container m-auto">
        <motion.div
          className={`flex flex-col lg:flex-row ${
            index % 2 !== 0 ? "lg:flex-row-reverse" : ""
          } lg:items-center gap-y-6 md:gap-y-8 lg:gap-y-0 p-5`}
          initial="hidden"
          animate={isVisible ? "show" : "hidden"}
        >
          <motion.div
            className="w-full max-w-[306px] lg:w-1/2 xl:w-4/12 m-auto flex items-center justify-center"
            variants={scaleUp}
            transition={{ delay: 0.2 }}
          >
            <div
              className="w-full h-0 pb-[100%] rounded-full bg-cover bg-center shadow-md"
              style={{
                backgroundImage: `url(${member.imageUrl})`,
                backgroundPosition: "top",
              }}
              alt={member.name}
            ></div>
          </motion.div>
          <div className="w-full lg:w-1/2 xl:w-7/12 flex items-center justify-center">
            <div className="flex justify-center xl:justify-evenly">
              <motion.div
                className="w-full xl:w-11/12"
                initial="hidden"
                animate={isVisible ? "show" : "hidden"}
                variants={fadeIn("up", 0.4)}
              >
                <motion.h2
                  className="mb-3 text-2xl font-bold text-gray-900 dark:text-white"
                  variants={fadeIn("up", 0.6)}
                >
                  {member.name}
                </motion.h2>
                <motion.p
                  className="text-lg text-orange-500 dark:text-yellow-400 mb-3"
                  variants={fadeIn("up", 0.8)}
                >
                  {member.title}
                </motion.p>
                <motion.p
                  className="text-gray-700 dark:text-gray-300 mb-5 text-justify"
                  variants={fadeIn("up", 1)}
                >
                  {member.description}
                </motion.p>
              </motion.div>
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
};

const OurTeams = () => {
  return (
    <div className="w-full m-auto">
      <div
        className="text-center bg-cover bg-center"
        style={{ backgroundImage: `url(${img1})` }}
      >
        <div className="bg-black bg-opacity-50 p-10">
          <motion.h3
            className="mb-2 text-3xl font-semibold text-white"
            initial="hidden"
            animate="show"
            variants={fadeIn("up", 0.4)}
          >
            Our Team
          </motion.h3>
          <motion.p
            className="text-lg text-gray-200"
            initial="hidden"
            animate="show"
            variants={fadeIn("up", 0.6)}
          >
            We’re a dynamic group of individuals who are passionate about what
            we do and dedicated to delivering the best results for our clients.
          </motion.p>
        </div>
      </div>
      {teamMembers.map((member, index) => (
        <TeamMemberSection key={index} member={member} index={index} />
      ))}
    </div>
  );
};

export default OurTeams;
