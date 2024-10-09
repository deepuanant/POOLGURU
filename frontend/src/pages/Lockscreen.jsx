import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import png1 from "../assets/poolguru-logo-grey.png";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import { FiLoader } from "react-icons/fi";
import { lockcheck } from "../api/userapi";

const LockScreen = ({ onUnlock }) => {
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isPasswordVisible, setIsPasswordVisible] = useState(false);
  const navigate = useNavigate();

  const handleUnlock = () => {
    if (!password) {
      toast.error("Please enter your password", {
        position: "top-center",
      });
      return;
    }
    const check = async () => {
      setIsLoading(true);
      try {
        const response = await lockcheck(password);
        if (response.status === 200) {
          // console.log(response);
          localStorage.setItem("isLocked", "false");
          document.body.style.overflow = "auto";
          const previousPage = sessionStorage.getItem("previousPage");
          onUnlock();
          navigate(previousPage || "/");
        } else {
          toast.error("Incorrect password", {
            position: "top-center",
          });
          setIsLoading(false);
        }
      } catch (error) {
        // console.log(error);
        toast.error("Incorrect password", {
          position: "top-center",
        });
        setIsLoading(false);
      }
    };

    check();
  };

  const togglePasswordVisibility = () => {
    setIsPasswordVisible((prevState) => !prevState);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      handleUnlock();
    }
  };

  return (
    <div className="fixed inset-0 bg-gradient-to-r from-orange-100 to-gray-100 flex justify-center items-center z-50">
      <div className="max-w-lg w-full rounded-lg border bg-white p-5 dark:bg-gray-800 shadow-lg">
        <img src={png1} alt="" className="w-24 m-auto py-3" />
        <h1 className="text-lg text-center font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-orange-400 dark:to-yellow-400">
          Enter Password to Unlock
        </h1>
        <div className="text-md text-center leading-tight tracking-tight text-gray-600 md:text-md dark:text-white mb-4">
          <lord-icon
            src="https://cdn.lordicon.com/khheayfj.json"
            trigger="loop"
            colors="primary:#f57c00,secondary:#f57c00"
            style={{ width: "100px", height: "100px" }}
          ></lord-icon>
        </div>
        <div className="mb-5">
          <label
            htmlFor="password"
            className="mb-2 block text-sm font-medium text-gray-900 dark:text-white"
          >
            Password
          </label>
          <div className="relative">
            <input
              type={isPasswordVisible ? "text" : "password"} // Toggle between "text" and "password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              onKeyDown={handleKeyDown} // Listen for Enter key
              className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
              placeholder="Enter Password"
              required
            />
            <button
              type="button"
              onClick={togglePasswordVisibility}
              className="absolute inset-y-0 right-0 pr-3 flex items-center text-sm leading-5 text-gray-500 dark:text-gray-400"
            >
              {isPasswordVisible ? <FaEyeSlash /> : <FaEye />}
            </button>
          </div>
        </div>
        <button
          onClick={handleUnlock}
          className="inline-flex w-full items-center justify-center text-white bg-gradient-to-r from-orange-500 to-yellow-500 border-2 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition transform hover:-translate-y-1 hover:scale-105 shadow-lg"
          disabled={isLoading}
        >
          {isLoading ? (
            <>
              Unlocking
              <FiLoader className="animate-spin ml-2" />
            </>
          ) : (
            "Unlock Screen"
          )}
        </button>
      </div>
    </div>
  );
};

export default LockScreen;
