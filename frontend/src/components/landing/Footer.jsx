import React from "react";
import { Link } from "react-router-dom";

function Footer() {
  const fromYear = 2024; // Set this to the year you started the website
  const toYear = new Date().getFullYear();

  return (
    <footer className="bg-gray-800 text-gray-300">
      <div className="mx-auto w-full max-w-screen-xl p-4 py-4 lg:py-6">
        <div className="md:flex md:justify-between">
          {/* Company Address and Info */}
          <div className="mb-4 md:mb-0">
            <Link to="/" className="flex items-center">
              <span className="self-center text-2xl font-semibold whitespace-nowrap text-white">
                Treyst Infotech Pvt Ltd
              </span>
            </Link>
            <div className="text-sm text-gray-400 mt-2 text-justify">
              <span>4th Floor, White House Bldg,</span>
              <br />
              <span>JP Road Junction, SV Road,</span>
              <br />
              <span>Andheri West, Mumbai - 400058</span>
            </div>
          </div>
          {/* Google Map Embed */}
          <div className="mb-4 md:mb-0">
            <div className="w-full h-24 rounded-lg overflow-hidden border border-gray-700 shadow-md">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d120629.19400464534!2d72.76367527720856!3d19.122464660015634!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x3be7c9d407689d15%3A0x1d9446fa48325716!2sWhite%20House%20Building%2C%20Swami%20Vivekananda%20Rd%2C%20Fish%20Market%20Area%2C%20Navneeth%20Colony%2C%20Andheri%20West%2C%20Mumbai%2C%20Maharashtra%20400058!5e0!3m2!1sen!2sin!4v1725015406240!5m2!1sen!2sin"
                className="w-full h-full filter grayscale-[0.5] opacity-90"
                style={{ border: "0" }}
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
                title="Company Location"
              ></iframe>
            </div>
          </div>
          {/* Company Links */}
          <div className="grid grid-cols-2 gap-8 sm:gap-6 sm:grid-cols-3">
            <div>
              <h2 className="mb-2 text-sm font-semibold text-gray-400 uppercase">
                Company
              </h2>
              <ul className="text-gray-400">
                <li className="mb-2">
                  <Link
                    to="/aboutus"
                    className="hover:underline hover:text-orange-500"
                  >
                    About
                  </Link>
                </li>
                <li>
                  <Link
                    to="/careers"
                    className="hover:underline hover:text-orange-500"
                  >
                    Careers
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-2 text-sm font-semibold text-gray-400 uppercase">
                Support
              </h2>
              <ul className="text-gray-400">
                <li className="mb-2">
                  <Link
                    to="/contactus"
                    className="hover:underline hover:text-orange-500"
                  >
                    Contact Us
                  </Link>
                </li>
                <li>
                  <Link
                    to="/FAQ"
                    className="hover:underline hover:text-orange-500"
                  >
                    FAQ
                  </Link>
                </li>
              </ul>
            </div>
            <div>
              <h2 className="mb-2 text-sm font-semibold text-gray-400 uppercase">
                Legal
              </h2>
              <ul className="text-gray-400">
                <li className="mb-2">
                  <Link
                    to="/privacy-policy"
                    className="hover:underline hover:text-orange-500"
                  >
                    Privacy Policy
                  </Link>
                </li>
                <li>
                  <Link
                    to="/terms"
                    className="hover:underline hover:text-orange-500"
                  >
                    Terms & Conditions
                  </Link>
                </li>
              </ul>
            </div>
          </div>
        </div>
        <hr className="my-4 border-gray-700 sm:mx-auto lg:my-4" />
        <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between text-center">
          <span className="text-sm text-gray-400 w-full text-center">
            © {fromYear === toYear ? toYear : `${fromYear} - ${toYear}`}, Treyst
            Infotech Pvt Ltd, All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;
