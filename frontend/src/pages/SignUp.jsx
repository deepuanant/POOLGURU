import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { register } from "../api/userapi";
import eye1 from "../assets/eye-outline.256x178.png";
import { FaCheck, FaTimes } from "react-icons/fa";
import GoogleButton from "../components/miscellaneous/GoogleButton";
import { FiLoader } from "react-icons/fi";

function SignUp() {
  const useLocal = import.meta.env.VITE_USE_LOCAL === "false";
  const host = useLocal
    ? import.meta.env.VITE_LOCAL_URL
    : import.meta.env.VITE_SERVER_URL;

  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showRepeatPasswordAlert, setShowRepeatPasswordAlert] = useState(false);
  const [repeatPasswordTouched, setRepeatPasswordTouched] = useState(false);
  const [loading, setLoading] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    lower: false,
    upper: false,
    number: false,
    special: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value);
    setShowRepeatPasswordAlert(false);
  };

  const googleLogin = async () => {
    const loadingToast = toast.loading("Logging in with Google...", {
      position: "top-center",
    });
    try {
      window.open(`${host}/auth/google`, "_self");
    } catch (error) {
      toast.error("Google Login Failed, please try again.", {
        id: loadingToast,
        duration: 3000,
        position: "top-center",
      });
      setTimeout(() => {
        navigate("/");
      }, 3000);
    }
  };

  const handleRepeatPasswordChange = (e) => {
    const value = e.target.value;
    setRepeatPassword(value);
    setRepeatPasswordTouched(true);
    if (password && value !== password) {
      setShowRepeatPasswordAlert(true);
    } else {
      setShowRepeatPasswordAlert(false);
    }
  };

  const handleSubmit = async (e) => {
    setLoading(true);
    e.preventDefault();
    if (password !== repeatPassword) {
      setShowRepeatPasswordAlert(true);
      return;
      setLoading(false);
    }

    try {
      const response = await register(username, email, password);
      if (response.status === 201) {
        const loadingToast = toast.loading("Registering...", {
          position: "top-center",
        });
        setTimeout(() => {
          toast.success("Registration successful! Please verify your email.", {
            id: loadingToast,
            duration: 4000,
            position: "top-center",
          });
          setTimeout(() => navigate("/login"), 4000);
        }, 1500);
        setLoading(false);
      } else {
        toast.error(
          response.data.msg || "Signup failed. Please check your credentials.",
          {
            duration: 4000,
            position: "top-center",
          }
        );
        setLoading(false);
      }
    } catch (error) {
      if (error.response) {
        toast.error(
          error.response.data.msg ||
            "Signup failed. Please check your credentials.",
          {
            duration: 4000,
            position: "top-center",
          }
        );
        setLoading(false);
      } else {
        toast.error("Signup Failed please try again.", {
          duration: 4000,
          position: "top-center",
        });
        setLoading(false);
      }
    }
  };

  const validatePassword = (value) => {
    setPasswordRequirements({
      length: value.length >= 8,
      lower: /[a-z]/.test(value),
      upper: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[!@#?$%^&*()_+{}[\]:;"'<>,./\\|~]/.test(value),
    });
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-100 to-gray-100">
        <div className="w-full max-w-lg p-6">
          <form
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            onSubmit={handleSubmit}
          >
            <h1 className="text-lg text-center font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-orange-400 dark:to-yellow-400">
              Create New Account
            </h1>
            <div className="flex justify-center">
              <lord-icon
                src="https://cdn.lordicon.com/jvucoldz.json"
                trigger="loop"
                colors="primary:#f57c00,secondary:#ffcc00"
                style={{ width: "100px", height: "100px" }}
              ></lord-icon>
            </div>

            <div className="mb-2">
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Username <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="username"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Username"
                required
                onChange={(e) => setUsername(e.target.value)}
              />
            </div>

            <div className="mb-2">
              <label
                htmlFor="email"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Email <span className="text-red-600"> *</span>
              </label>
              <input
                type="email"
                id="email"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Enter Email"
                required
                onChange={(e) => setEmail(e.target.value)}
              />
            </div>

            <div className="relative mb-2">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <input
                type={showPassword ? "text" : "password"}
                id="password-input"
                placeholder="Enter Password"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                required
                onChange={handlePasswordChange}
                onFocus={() =>
                  (document.getElementById("password-contain").style.display =
                    "block")
                }
                onBlur={() =>
                  (document.getElementById("password-contain").style.display =
                    "none")
                }
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute inset-y-0 right-0 flex items-center pr-3 mt-6"
              >
                {showPassword ? (
                  <img src={eye1} alt="Show Password" className="w-6" />
                ) : (
                  <svg
                    fill="none"
                    height={24}
                    viewBox="0 0 24 24"
                    width={24}
                    xmlns="http://www.w3.org/2000/svg"
                  >
                    <g
                      stroke="#000"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                    >
                      <path d="m2 2 20 20" />
                      <path d="m6.71277 6.7226c-3.04798 2.07267-4.71277 5.2774-4.71277 5.2774s3.63636 7 10 7c2.0503 0 3.8174-.7266 5.2711-1.7116m-6.2711-12.23018c.3254-.03809.6588-.05822 1-.05822 6.3636 0 10 7 10 7s-.6918 1.3317-2 2.8335" />
                      <path d="m14 14.2362c-.5308.475-1.2316.7639-2 .7639-1.6569 0-3-1.3431-3-3 0-.8237.33193-1.5698.86932-2.11192" />
                    </g>
                  </svg>
                )}
              </button>
            </div>

            <div className="mb-5">
              <label
                htmlFor="repeat-password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Repeat password
              </label>
              <input
                type="password"
                id="confirm-password-input"
                placeholder="Confirm Password"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                required
                onChange={handleRepeatPasswordChange}
                onBlur={() => setRepeatPasswordTouched(true)}
              />
            </div>

            <div
              id="password-contain"
              className="p-3 bg-gray-200 mb-2 rounded"
              style={{ display: "none" }}
            >
              <h5 className="fs-4 mb-1 text-gray-900 dark:text-gray-100 lg:text-md">
                Password must contain:
              </h5>
              <p
                className={`fs-4 mb-2 lg:text-sm ${
                  passwordRequirements.length
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {passwordRequirements.length ? (
                  <FaCheck className="inline" />
                ) : (
                  <FaTimes className="inline" />
                )}{" "}
                Minimum <b>8 characters</b>
              </p>
              <p
                className={`fs-4 mb-2 lg:text-sm ${
                  passwordRequirements.lower
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {passwordRequirements.lower ? (
                  <FaCheck className="inline" />
                ) : (
                  <FaTimes className="inline" />
                )}{" "}
                At least one <b>lowercase</b> letter (a-z)
              </p>
              <p
                className={`fs-4 mb-2 lg:text-sm ${
                  passwordRequirements.upper
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {passwordRequirements.upper ? (
                  <FaCheck className="inline" />
                ) : (
                  <FaTimes className="inline" />
                )}{" "}
                At least one <b>uppercase</b> letter (A-Z)
              </p>
              <p
                className={`fs-4 mb-2 lg:text-sm ${
                  passwordRequirements.number
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {passwordRequirements.number ? (
                  <FaCheck className="inline" />
                ) : (
                  <FaTimes className="inline" />
                )}{" "}
                At least one <b>number</b> (0-9)
              </p>
              <p
                className={`fs-4 mb-0 lg:text-sm ${
                  passwordRequirements.special
                    ? "text-green-600"
                    : "text-orange-600"
                }`}
              >
                {passwordRequirements.special ? (
                  <FaCheck className="inline" />
                ) : (
                  <FaTimes className="inline" />
                )}{" "}
                Inclusion of at least one <b>special character</b>, e.g., ! @ #
                ?
              </p>
            </div>

            {repeatPasswordTouched && showRepeatPasswordAlert && (
              <div
                className="flex p-4 mb-4 text-sm text-red-800 rounded-lg bg-red-50 dark:bg-gray-800 dark:text-red-400"
                role="alert"
              >
                <svg
                  className="flex-shrink-0 inline w-4 h-4 me-3 mt-[2px]"
                  aria-hidden="true"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="currentColor"
                  viewBox="0 0 20 20"
                >
                  <path d="M10 .5a9.5 9.5 0 1 0 9.5 9.5A9.51 9.51 0 0 0 10 .5ZM9.5 4a1.5 1.5 0 1 1 0 3 1.5 1.5 0 0 1 0-3ZM12 15H8a1 1 0 0 1 0-2h1v-3H8a1 1 0 0 1 0-2h2a1 1 0 0 1 1 1v4h1a1 1 0 0 1 0 2Z" />
                </svg>
                <span className="sr-only">Error</span>
                <div>
                  <span className="font-medium">Passwords do not match:</span>
                  <ul className="mt-1.5 list-disc list-inside">
                    <li>
                      Ensure the repeat password matches the original password.
                    </li>
                  </ul>
                </div>
              </div>
            )}

            <div className="flex items-start mb-5">
              <div className="flex items-center h-5">
                <input
                  id="terms"
                  type="checkbox"
                  className="w-4 h-4 border border-gray-300 rounded focus:ring-3 focus:ring-blue-300 dark:border-gray-600 dark:focus:ring-blue-600"
                  required
                />
              </div>
              <div className="ms-3 text-sm">
                <label
                  htmlFor="terms"
                  className="font-light text-gray-500 dark:text-gray-300"
                >
                  I accept the{" "}
                  <Link
                    to="/terms"
                    className="font-medium text-orange-400 hover:underline dark:text-blue-500"
                  >
                    Terms and Conditions
                  </Link>
                </label>
              </div>
            </div>

            <button
              type="submit"
              className="flex items-center w-full justify-center text-white bg-gradient-to-r from-orange-500 to-yellow-500 border-2 rounded-lg px-4 py-2 font-medium text-base dark:text-orange-400 dark:hover:text-orange-500  duration-300 cursor-pointer transition-transform transform hover:scale-105"
              disabled={loading}
            >
              {loading ? (
                <>
                  Registering.....
                  <FiLoader className="animate-spin ml-2" />
                </>
              ) : (
                "Create an account"
              )}
              {/* <i className="mdi mdi-account-plus-outline mr-2"></i>Create an
              account */}
            </button>

            <p className="text-sm font-light text-center text-gray-500 dark:text-gray-400 mt-4">
              Already have an account?{" "}
              <Link
                to="/login"
                className="font-medium text-orange-400 hover:underline dark:text-blue-500"
              >
                Signin
              </Link>
            </p>

            <div className="mt-1 text-center">
              <div className="signin-other-title">
                <h5 className="text-md font-bold text-center text-gray-500 dark:text-gray-400  mb-2">
                  or
                </h5>
              </div>
              <div className="space-x-2 flex flex-row items-center justify-center">
                {/* google */}
                <GoogleButton onClick={googleLogin}>
                  {" "}
                  Sign up with Google
                </GoogleButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default SignUp;
