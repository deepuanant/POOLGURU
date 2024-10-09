import React, { useRef, useEffect } from "react";
import { motion, useAnimation } from "framer-motion";
import useIntersectionObserver from "../../hooks/useIntersectionObserver";

function Hero4() {
  const ref = useRef(null);
  const isInView = useIntersectionObserver(ref, { threshold: 0.1 });

  const controls1 = useAnimation();
  const controls2 = useAnimation();
  const controls3 = useAnimation();
  const controls4 = useAnimation();
  const controls5 = useAnimation();
  const controls6 = useAnimation();
  const controls7 = useAnimation();
  const controls8 = useAnimation();

  const svgVariants = {
    hidden: { opacity: 0, x: -50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeInOut" } } // Improved transition
  };

  const svgVariantsRight = {
    hidden: { opacity: 0, x: 50 },
    show: { opacity: 1, x: 0, transition: { duration: 0.5, ease: "easeInOut" } } // Improved transition
  };

  useEffect(() => {
    if (isInView) {
      controls1.start("show").then(() => {
        setTimeout(() => controls2.start("show"), 300);
      }).then(() => {
        setTimeout(() => {
          controls3.start("show");
          controls4.start("show");
          controls5.start("show");
          controls6.start("show");
          controls7.start("show");
          controls8.start("show");
        }, 600);
      });
    } else {
      controls1.start("hidden");
      controls2.start("hidden");
      controls3.start("hidden");
      controls4.start("hidden");
      controls5.start("hidden");
      controls6.start("hidden");
      controls7.start("hidden");
      controls8.start("hidden");
    }
  }, [isInView, controls1, controls2, controls3, controls4, controls5, controls6, controls7, controls8]);

  return (
    <section ref={ref} className="bg-gradient-to-r from-orange-100 to-gray-100 dark:bg-gray-900">
      <div className="items-center max-w-screen-xl px-4 py-4 mx-auto lg:grid lg:grid-cols-4 lg:gap-16 xl:gap-24 lg:py-12 lg:px-6">
        
        {/* Main Content */}
        <motion.div
          initial="hidden"
          animate={controls1}
          variants={svgVariants}
          className="col-span-2 mb-8"
        >
          <motion.h2
            className="mt-3 mb-4 text-3xl font-extrabold tracking-tight md:text-3xl dark:text-white bg-clip-text text-transparent bg-gradient-to-r from-orange-500 to-yellow-500"
          >
            Trusted by over 600 million users and 10,000 teams
          </motion.h2>
          <motion.p
            initial="hidden"
            animate={controls2}
            variants={svgVariants}
            transition={{ duration: 0.5, ease: "easeInOut" }} // Improved transition
            className="mb-8 text-gray-700 lg:text-xl"
          >
            Our rigorous security and compliance standards are at the heart of
            all we do. We work tirelessly to protect you and your customers.
          </motion.p>
          <div className="pt-6 mt-6 space-y-4 border-t border-gray-200 dark:border-gray-700">
            {[
              { text: "Explore Legality Guide", animation: controls3 },
              { text: "Visit the Trust Center", animation: controls4 }
            ].map((button, index) => (
              <div key={index}>
                <button
                  className="inline-flex items-center text-base font-medium text-orange-600 hover:text-orange-800 dark:text-orange-500 dark:hover:text-orange-700 transition transform hover:-translate-y-1 hover:scale-105"
                  onClick={() => window.location.href = '#'}
                >
                  {button.text}
                  <motion.svg
                    className="w-5 h-5 ml-1"
                    fill="currentColor"
                    viewBox="0 0 20 20"
                    xmlns="http://www.w3.org/2000/svg"
                    initial="hidden"
                    animate={button.animation}
                    variants={svgVariantsRight}
                  >
                    <path
                      fillRule="evenodd"
                      d="M12.293 5.293a1 1 0 011.414 0l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414-1.414L14.586 11H3a1 1 0 110-2h11.586l-2.293-2.293a1 1 0 010-1.414z"
                      clipRule="evenodd"
                    />
                  </motion.svg>
                </button>
              </div>
            ))}
          </div>
        </motion.div>

        {/* Icons and Descriptions */}
        <div className="col-span-2 space-y-8 md:grid md:grid-cols-2 md:gap-12 md:space-y-0">
          {[
            { icon: controls5, title: "99.99% uptime", description: "For Landwind, with zero maintenance downtime" },
            { icon: controls6, title: "600M+ Users", description: "Trusted by over 600 million users around the world" },
            { icon: controls7, title: "100+ countries", description: "Have used Landwind to create functional websites" },
            { icon: controls8, title: "5+ Million", description: "Transactions per day", variant: svgVariantsRight }
          ].map((item, index) => (
            <div key={index}>
              <motion.svg
                className="w-10 h-10 mb-2 text-orange-600 md:w-12 md:h-12 dark:text-orange-500"
                fill="currentColor"
                viewBox="0 0 20 20"
                xmlns="http://www.w3.org/2000/svg"
                initial="hidden"
                animate={item.icon}
                variants={item.variant || svgVariants}
              >
                <path
                  fillRule="evenodd"
                  d="M10 18a8 8 0 100-16 8 8 0 000 16zM4.332 8.027a6.012 6.012 0 011.912-2.706C6.512 5.73 6.974 6 7.5 6A1.5 1.5 0 019 7.5V8a2 2 0 004 0 2 2 0 011.523-1.943A5.977 5.977 0 0116 10c0 .34-.028.675-.083 1H15a2 2 0 00-2 2v2.197A5.973 5.973 0 0110 16v-2a2 2 0 00-2-2 2 2 0 01-2-2 2 2 0 00-1.668-1.973z"
                  clipRule="evenodd"
                />
              </motion.svg>
              <h3 className="mb-2 text-2xl text-grey-700 font-bold">
                {item.title}
              </h3>
              <p className="font-light text-gray-600">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}

export default Hero4;
