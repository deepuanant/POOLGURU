import React from "react";

const ServicesGrid = () => {
  const services = [
    {
      title: "Pool Scrubbing",
      description:
        "Thorough cleaning and maintenance of financial pools to ensure data accuracy and compliance.",
      imageUrl:
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/280406/seattle-botanical-gardens.jpg",
    },
    {
      title: "Payout Monitoring",
      description:
        "Continuous tracking of payout processes to ensure timely and accurate disbursements.",
      imageUrl:
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/280406/seattle-library-sm.jpg",
    },
    {
      title: "Loss Estimation",
      description:
        "Accurate prediction and calculation of potential financial losses to mitigate risks.",
      imageUrl:
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/280406/seattle-skylight-sm.jpg",
    },
    {
      title: "Pool Reconciliation",
      description:
        "Regular balancing and verification of financial pools to maintain accuracy and integrity.",
      imageUrl:
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/280406/madison-overture.jpg",
    },
    {
      title: "Direct Assignment",
      description:
        "Assigning loans and assets directly to entities with minimal intermediaries to streamline processes.",
      imageUrl:
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/280406/madison-rainbow.jpg",
    },
    {
      title: "Co-lending",
      description:
        "Partnerships with financial institutions to provide joint lending solutions, enhancing credit availability.",
      imageUrl:
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/280406/madison-overture.jpg",
    },
    {
      title: "Securitization & Pass-Through Certificate",
      description:
        "Conversion of financial assets into securities for trading, providing liquidity and investment opportunities.",
      imageUrl:
        "https://s3-us-west-2.amazonaws.com/s.cdpn.io/280406/seattle-skylight-sm.jpg",
    },
  ];

  return (
    <div>
      {services.map((service, index) => (
        <div
          key={index}
          className={`ml-5 flex flex-col md:flex-row mb-8 ${
            index % 2 !== 0 ? "md:flex-row-reverse" : ""
          }`}
        >
          <div
            className="relative flex-1 bg-cover bg-center h-80 md:h-auto rounded-2xl overflow-hidden"
            style={{ backgroundImage: `url(${service.imageUrl})` }}
          >
            <div className="absolute inset-0 bg-black bg-opacity-50 opacity-0 hover:opacity-100 flex items-center justify-center transition-opacity duration-300">
              <div className="text-white p-4 md:p-8 text-center">
                <h3 className="text-xl font-semibold mb-2">{service.title}</h3>
                <p className="text-lg">{service.description}</p>
              </div>
            </div>
          </div>
          <div className="flex-1 flex items-center justify-center p-6 md:p-12">
            <div className="w-4/5 md:w-3/5 text-center">
              <h3 className="mr-2 text-xl font-semibold mb-4">{service.title}</h3>
              <p className="text-lg">{service.description}</p>
            </div>
          </div>
        </div>
      ))}
    </div>
  );
};

export default ServicesGrid;
