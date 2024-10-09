import React, { useState } from "react";
import { sendNotification } from "../../../api/adminapi";
import ScrollToTopButton from "../../miscellaneous/ScrollToTopButton";

function NotificationPage() {
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");

  const handleChange = (e) => {
    const { id, value } = e.target;
    if (id === "title") {
      setTitle(value);
    } else if (id === "message") {
      setMessage(value);
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const response = await sendNotification(title, message);
      if (response.status === 200) {
        alert(response.data.message);
        setTitle("");
        setMessage("");
      } else {
      }
    } catch (error) {
      if (error.response) {
      } else {
      }
    }
  };

  return (
    <div>
      <div className=" bg-white">
        <section
          id="notifications"
          className="py-4 bg-white-100 dark:from-gray-900 dark:to-gray-700"
        >
          <div className="container mx-auto px-6">
            <div className="text-center mb-8">
              <h3 className="text-2xl font-semibold text-center mb-2 leading-tight tracking-tight text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
                Send Notification
              </h3>
              <p className="text-slate-500 mb-2 text-md">
                Reach out to your users by sending notifications from this page.
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
                      Notification Title <span className="text-red-500">*</span>
                    </label>
                    <input
                      id="title"
                      type="text"
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter Notification Title"
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
                      Notification Message{" "}
                      <span className="text-red-500">*</span>
                    </label>
                    <textarea
                      id="message"
                      rows="4"
                      className="block w-full px-4 py-2 border border-gray-300 rounded-lg shadow-sm focus:ring-blue-500 focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:ring-blue-500 dark:focus:border-blue-500"
                      placeholder="Enter Notification Message"
                      value={message}
                      onChange={handleChange}
                      required
                    />
                  </div>
                  <div className="text-right mt-3 mb-5">
                    <input
                      type="submit"
                      id="submit"
                      className="w-full text-white bg-orange-500 hover:bg-orange-400 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition transform hover:-translate-y-1 hover:scale-105 shadow-lg"
                      value="Send Notification"
                    />
                  </div>
                </form>
              </div>
            </div>
          </div>
        </section>
      </div>
      <ScrollToTopButton />
    </div>
  );
}

export default NotificationPage;
