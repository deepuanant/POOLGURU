import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { sendresentlink } from "../api/userapi.js";
import { useNavigate } from "react-router-dom";

function Resetpass1() {
  const [email, setEmail] = useState("");
  const [isLoading] = useState(false);
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadingToast = toast.loading("Sending link to your mail....", {
      position: "top-center",
    });

    try {
      const response = await sendresentlink(email);
      // console.log(response);
      if (response.status === 200) {
        toast.success("Reset Password mail sent successfully!", {
          id: loadingToast,
          duration: 5000,
          position: "top-center",
        });
        setTimeout(() => navigate("/login"), 5000);
        // navigate("/change-password");
      } else {
        toast.error(response.data.message, {
          id: loadingToast,
          duration: 5000,
          position: "top-center",
        });
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Something Went Wrong.", {
          id: loadingToast,
          duration: 5000,
          position: "top-center",
        });
      } else {
        toast.error("Something Went Wrong.", {
          id: loadingToast,
          duration: 5000,
          position: "top-center",
        });
      }
    }
  };

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-r from-orange-100 to-gray-100">
        <div className="w-screen-xl justify-content-center m-auto p-10">
          <form
            className="mx-auto max-w-lg rounded-lg border bg-white p-8 dark:bg-gray-800"
            onSubmit={handleSubmit}
          >
            <h1 className="text-lg text-center font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-orange-400 dark:to-yellow-400">
              Forgot Password?
            </h1>
            <div className="text-md text-center leading-tight tracking-tight text-gray-600 md:text-md dark:text-white">
              <lord-icon
                src="https://cdn.lordicon.com/rhvddzym.json"
                trigger="loop"
                colors="primary:#f57c00,secondary:#ffcc00"
                style={{ width: "100px", height: "100px" }}
              ></lord-icon>
            </div>
            <div
              class="p-4 text-center mb-4 text-sm text-yellow-800 rounded-lg bg-yellow-50 dark:bg-gray-800 dark:text-yellow-300"
              role="alert"
            >
              Enter your Email and instruction will be send to you
            </div>
            <div className="mb-5">
              <label
                htmlFor="email"
                className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
              >
                Email
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <svg
                    className="h-4 w-4 text-gray-500 dark:text-gray-400"
                    aria-hidden="true"
                    xmlns="http://www.w3.org/2000/svg"
                    fill="currentColor"
                    viewBox="0 0 20 16"
                  >
                    <path d="m10.036 8.278 9.258-7.79A1.979 1.979 0 0 0 18 0H2A1.987 1.987 0 0 0 .641.541l9.395 7.737Z" />
                    <path d="M11.241 9.817c-.36.275-.801.425-1.255.427-.428 0-.845-.138-1.187-.395L0 2.6V14a2 2 0 0 0 2 2h16a2 2 0 0 0 2-2V2.5l-8.759 7.317Z" />
                  </svg>
                </div>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  placeholder="Enter Email"
                  required
                />
              </div>
            </div>

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center text-white bg-gradient-to-r from-orange-500 to-yellow-500 border-2 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition transform hover:-translate-y-1 hover:scale-105 shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                "Sending..."
              ) : (
                <>
                  <i className="mdi mdi-lock-reset mr-2"></i>Send Reset Link
                </>
              )}
            </button>

            <p className="mt-5  text-sm text-center font-light text-gray-500 dark:text-gray-400">
              Wait,I remember my password{" "}
              <a
                href="/login"
                className="font-medium text-orange-400 hover:underline dark:text-primary-500"
              >
                Click here
              </a>
            </p>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Resetpass1;
