import React, { useState } from "react";
import { sendmessage } from "../../api/userapi";
import { toast } from "react-hot-toast";

function Contactus() {
  const [formData, setFormData] = useState({
    FirstName: "",
    LastName: "",
    JobTitle: "",
    CompanyName: "",
    PhoneNo: "",
    Email: "",
    AnnualRevenue: "",
    CompanySize: "",
    Subject: "",
    Message: "",
  });

  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [id]: value,
    }));
  };

  const handleSubmit = async (e) => {
    const loading = toast.loading("Sending message...");
    e.preventDefault();
    try {
      const response = await sendmessage(formData);
      // console.log(response);
      if (response.status === 201) {
        setFormData({
          FirstName: "",
          LastName: "",
          JobTitle: "",
          CompanyName: "",
          PhoneNo: "",
          Email: "",
          AnnualRevenue: "",
          CompanySize: "",
          Subject: "",
          Message: "",
        });
        toast.success("Message sent successfully!", {
          id: loading,
          duration: 5000,
          position: "top-center",
        });
        setMessage("Message sent successfully!");
      } else {
        setMessage("Failed to send message. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        console.error(error.response.data.message);
        toast.error("Failed to send message. Please try again.", {
          id: loading,
          duration: 5000,
          position: "top-center",
        });

        setMessage(error.response.data.message);
      } else {
        console.error("Failed to send message:", error);
        toast.error("Failed to send message. Please try again.", {
          id: loading,
          duration: 5000,
          position: "top-center",
        });

        setMessage("Failed to send message. Please try again.");
      }
    }
  };

  return (
    <div>
      <div className="">
        <section
          id="contact"
          className="py-8 bg-gradient-to-r from-orange-100 to-gray-100 dark:from-gray-900 dark:to-gray-700"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-8">
              <h3 className="mb-2 text-3xl font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-orange-400 dark:to-yellow-400">
                Get In Touch
              </h3>
              <p className="text-slate-500 mb-2 text-md">
                We thrive when it comes to innovative ideas but also <br />
                understand that a smart concept should be supported with
                measurable results.
              </p>
            </div>
            <div className="flex flex-wrap justify-center">
              <div className="w-full lg:w-2/3">
                <form
                  className="max-w-2xl mx-auto border p-5 bg-white dark:bg-gray-800 rounded-lg shadow-lg"
                  onSubmit={handleSubmit}
                >
                  <div className="flex flex-wrap -mx-3">
                    <div className="w-full lg:w-1/2 px-3 mb-2">
                      <label
                        htmlFor="firstName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        First Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="FirstName"
                        type="text"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-orange-500 dark:focus:border-orange-500"
                        placeholder="Enter First Name"
                        value={formData.FirstName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="w-full lg:w-1/2 px-3 mb-2">
                      <label
                        htmlFor="lastName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Last Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="LastName"
                        type="text"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-orange-500 dark:focus:border-orange-500"
                        placeholder="Enter Last Name"
                        value={formData.LastName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3">
                    <div className="w-full lg:w-1/2 px-3 mb-2">
                      <label
                        htmlFor="jobTitle"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Job Title <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="JobTitle"
                        type="text"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-orange-500 dark:focus:border-orange-500"
                        placeholder="Enter Job Title"
                        value={formData.JobTitle}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="w-full lg:w-1/2 px-3 mb-2">
                      <label
                        htmlFor="companyName"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Company Name <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="CompanyName"
                        type="text"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-orange-500 dark:focus:border-orange-500"
                        placeholder="Enter Company Name"
                        value={formData.CompanyName}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3">
                    <div className="w-full lg:w-1/2 px-3 mb-2">
                      <label
                        htmlFor="phoneNumber"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Phone Number <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="PhoneNo"
                        type="tel"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-orange-500 dark:focus:border-orange-500"
                        placeholder="Enter Phone Number"
                        value={formData.PhoneNumber}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="w-full lg:w-1/2 px-3 mb-2">
                      <label
                        htmlFor="email"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Email <span className="text-red-500">*</span>
                      </label>
                      <input
                        id="Email"
                        type="email"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-orange-500 dark:focus:border-orange-500"
                        placeholder="Enter Email"
                        value={formData.Email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>
                  <div className="flex flex-wrap -mx-3 mb-6">
                    <div className="w-full lg:w-1/2 px-3 mb-6">
                      <label
                        htmlFor="annualRevenue"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Company Annual Revenue{" "}
                        <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="AnnualRevenue"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-orange-500 dark:focus:border-orange-500"
                        value={formData.AnnualRevenue}
                        onChange={handleChange}
                        required
                      >
                        <option>Please Select</option>
                        <option>Less than 3 Cr</option>
                        <option>3 - 10 Cr</option>
                        <option>10 - 100 Cr</option>
                        <option>100 - 500 Cr</option>
                        <option>500 - 1500 Cr</option>
                        <option>More than 1500 Cr</option>
                      </select>
                    </div>
                    <div className="w-full lg:w-1/2 px-3 mb-6">
                      <label
                        htmlFor="companySize"
                        className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                      >
                        Company Size <span className="text-red-500">*</span>
                      </label>
                      <select
                        id="CompanySize"
                        className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-orange-500 dark:focus:border-orange-500"
                        value={formData.CompanySize}
                        onChange={handleChange}
                        required
                      >
                        <option>Please Select</option>
                        <option>1-10 employees</option>
                        <option>11-50 employees</option>
                        <option>51-200 employees</option>
                        <option>201-500 employees</option>
                        <option>501-1000 employees</option>
                        <option>More than 1000 employees</option>
                      </select>
                    </div>
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="subject"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Subject <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="Subject"
                      type="text"
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-orange-500 dark:focus:border-orange-500"
                      placeholder="Your subject"
                      value={formData.Subject}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="comments"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="Message"
                      rows="4"
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-orange-500 focus:border-orange-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-orange-500 dark:focus:border-orange-500"
                      placeholder="Your message..."
                      value={formData.Message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="text-right mt-3 mb-5">
                    <button
                      type="submit"
                      id="submit"
                      className="flex items-center w-full justify-center text-white bg-gradient-to-r from-orange-500 to-yellow-500 border-2 rounded-lg px-4 py-2 font-medium text-base dark:text-orange-400 dark:hover:text-orange-500  duration-300 cursor-pointer transition-transform transform hover:scale-105"
                    >
                      <i className="mdi mdi-send mr-2"></i>Send Message
                    </button>
                  </div>
                </form>
                {message && (
                  <p className="text-center text-red-500">{message}</p>
                )}
              </div>
            </div>
          </div>
        </section>
      </div>
    </div>
  );
}

export default Contactus;
