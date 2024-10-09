import React, { useState } from "react";
import ScrollToTopButton from "../../miscellaneous/ScrollToTopButton";
import { sendCircular } from "../../../api/adminapi"; // Import your API function for sending Circulars
import { toast } from "react-hot-toast";

function Circularupload() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [date, setDate] = useState("");
  const [pdfFile, setPdfFile] = useState(null);
  const [url, setUrl] = useState(""); // Add state for URL

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "title") {
      setTitle(value);
    } else if (id === "message") {
      setMessage(value);
    } else if (id === "url") {
      // Handle URL input changes
      setUrl(value);
    } else if (id === "date") {
      setDate(value);
    }
  };

  const handlePDFUpload = async (e) => {
    const file = e.target.files[0];
    if (file) {
      setPdfFile(file);
    }
  };

  const handleSubmit = async (e) => {
    const loadingToast = toast.loading("Sending Circular...", {
      position: "top-right",
    }); // Show loading toast
    e.preventDefault();
    try {
      const circulardata = new FormData();
      circulardata.append("title", title);
      circulardata.append("message", message);
      circulardata.append("url", url);
      circulardata.append("date", date);
      if (pdfFile) {
        circulardata.append("pdf", pdfFile);
      }

      const response = await sendCircular(circulardata);
      if (response.status === 200) {
        toast.success(response.data.message, {
          id: loadingToast,
          position: "top-right",
          duration: 5000,
        });
        toast.dismiss(loadingToast);
        setTitle("");
        setMessage("");
        setPdfFile(null);
        setUrl("");
        setDate("");
        document.getElementById("pdf").value = "";
      } else {
        toast.error(response.error.data.message || "Failed to send circular", {
          id: loadingToast,
          position: "top-right",
          duration: 5000,
        });
        toast.dismiss(loadingToast);
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      if (error.response) {
        toast.error(
          error.response.data.message ||
            "Failed to send Circular. Please try again.",
          {
            id: loadingToast,
            position: "top-right",
            duration: 5000,
          }
        );
      }
    }
  };

  return (
    <div>
      <div className="">
        <section
          id="Circulars"
          className="py-6 bg-white dark:from-gray-900 dark:to-gray-700"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-center mb-2 leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
                Send Circular
              </h3>
              <p className="text-slate-500 mb-2 text-md">
                Reach out to your users by sending Circulars from this page.
              </p>
            </div>
            <div className="flex flex-wrap justify-center">
              <div className="w-full lg:w-2/3">
                <form
                  className="max-w-2xl mx-auto border p-5 bg-white dark:bg-gray-800 rounded-lg shadow-xl"
                  onSubmit={handleSubmit}
                >
                  <div className="mb-6">
                    <label
                      htmlFor="title"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Circular Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      type="text"
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter Circular Title"
                      value={title}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="message"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Circular Message <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter Circular Message"
                      value={message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="url"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Circular URL (Optional)
                    </label>
                    <input
                      id="url"
                      type="text"
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter URL for Circular"
                      value={url}
                      onChange={handleChange}
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="pdf"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Upload PDF (Optional)
                    </label>
                    <input
                      id="pdf"
                      type="file"
                      accept=".pdf"
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      onChange={handlePDFUpload}
                    />
                  </div>
                  <div className="mb-6">
                    <label
                      htmlFor="date"
                      className="block text-sm font-medium text-gray-700 dark:text-gray-300 mb-2"
                    >
                      Circular Date <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="date"
                      type="date"
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      value={date}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="text-right mt-3 mb-5">
                    <input
                      type="submit"
                      id="submit"
                      className="w-full text-white bg-orange-500 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition transform hover:-translate-y-1 hover:scale-105 shadow-lg"
                      value="Send Circular"
                    />
                  </div>
                </form>
                {/* {feedback && (
                  <p className="text-center text-red-500">{feedback}</p>
                )} */}
              </div>
            </div>
          </div>
        </section>
      </div>
      <ScrollToTopButton />
    </div>
  );
}

export default Circularupload;
