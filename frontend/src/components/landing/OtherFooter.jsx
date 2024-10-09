import React from "react";

function Footer() {
  const fromYear = 2024; // Set this to the year you started the website
  const toYear = new Date().getFullYear();

  return (
    <footer className="py-4 text-gray-300 bg-gray-800">
      <div className="w-full max-w-screen-xl px-4 mx-auto text-center">
        <div className="flex justify-center">
          <span className="text-sm text-gray-400">
            © {fromYear === toYear ? toYear : `${fromYear} - ${toYear}`}, Treyst Infotech Pvt Ltd, All Rights Reserved.
          </span>
        </div>
      </div>
    </footer>
  );
}

export default Footer;