import React, { useState, useEffect } from "react";
import { loginverify, sendgmailotp } from "../api/userapi";
import { useNavigate } from "react-router-dom";
import { toast } from "react-hot-toast";
import { useLocation } from "react-router-dom";
import png1 from "../assets/PoolGuru_Logo.png";
import { useDispatch } from "react-redux";
import { addUser } from "../Redux/userslice";

const OTPVerification = () => {
  const [otp, setOtp] = useState(new Array(6).fill(""));
  const [timer, setTimer] = useState(300); // 5 minutes in seconds
  const [showResend, setShowResend] = useState(false);
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();
  const { token } = location.state;

  useEffect(() => {
    if (timer > 0) {
      const countdown = setInterval(() => {
        setTimer((prevTimer) => prevTimer - 1);
      }, 1000);
      return () => clearInterval(countdown);
    } else {
      setShowResend(true);
    }
  }, [timer]);

  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds < 10 ? "0" : ""}${remainingSeconds}`;
  };

  const handleChange = (element, index) => {
    if (isNaN(element.value)) return false;
    const newOtp = [...otp];
    newOtp[index] = element.value;
    setOtp(newOtp);

    if (element.nextSibling) {
      element.nextSibling.focus();
    }
  };

  const handlePaste = (event) => {
    const pastedData = event.clipboardData.getData("text").trim();
    if (/^\d{6}$/.test(pastedData)) {
      setOtp(pastedData.split(""));
    } else {
      toast.error("Invalid OTP format. Please paste a 6-digit OTP.");
    }
    event.preventDefault();
  };

  const verifyOtp = async () => {
    const loadingToast = toast.loading("Logging in...", {
      position: "top-center",
    });

    try {
      const otpValue = otp.join("");
      const response = await loginverify(token, otpValue);
      // console.log(response);
      if (
        response.status === 200 &&
        response.data.message === "Login successful"
      ) {
        localStorage.setItem("user", JSON.stringify(response.data.user));
        localStorage.setItem("token", response.data.token);
        dispatch(addUser(response.data.user));
        toast.success("OTP verified successfully!", {
          id: loadingToast,
          duration: 3000,
          position: "top-center",
        });
        setTimeout(() => {
          navigate("/");
        }, 3000);
      } else if (response.status === 400) {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.msg ||
            "Login failed. Please check your credentials.",
          {
            id: loadingToast,
            duration: 3000,
            position: "top-center",
          }
        );
      } else {
        toast.error("Login Failed, please try again.", {
          id: loadingToast,
          duration: 3000,
          position: "top-center",
        });
      }
    }
  };

  const handleKeyDown = (e, index) => {
    if (e.key === "Backspace" && !otp[index] && index !== 0) {
      e.target.previousSibling.focus();
    }
  };

  const resendOtp = async () => {
    const data = await sendgmailotp(token);
    if (data.status === 200) {
      toast.success("OTP resent successfully!");
    } else {
      toast.error(data.data.message);
    }
    setTimer(300); // Reset the timer
    setShowResend(false);
  };

  return (
    <>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-100 to-gray-100">
        <div className="w-full max-w-md p-6">
          <div className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6">
            <img src={png1} alt="Logo" className="w-24 mx-auto py-3" />
            <h2 className="text-2xl font-semibold text-center mb-5 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-orange-400 dark:to-yellow-400">
              OTP Verification
            </h2>
            <div className="text-center mb-5">
              {showResend ? (
                <button className="text-blue-500 underline" onClick={resendOtp}>
                  Resend OTP
                </button>
              ) : (
                <span>Time remaining: {formatTime(timer)}</span>
              )}
            </div>
            <div className="flex space-x-1 justify-center">
              {otp.map((data, index) => (
                <input
                  key={index}
                  type="text"
                  maxLength="1"
                  className="w-10 h-10 text-center border-2 border-gray-300 rounded-md focus:outline-none focus:border-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:focus:border-blue-500"
                  value={data}
                  onChange={(e) => handleChange(e.target, index)}
                  onKeyDown={(e) => handleKeyDown(e, index)}
                  onPaste={handlePaste}
                />
              ))}
            </div>
            <button
              className="mt-5 w-full text-white bg-orange-500 hover:bg-orange-300 focus:ring-4 focus:outline-none focus:ring-blue-300 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition transform hover:-translate-y-1 hover:scale-105 shadow-lg"
              onClick={verifyOtp}
            >
              Verify OTP
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default OTPVerification;
