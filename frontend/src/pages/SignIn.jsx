import React, { useState } from "react";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { login } from "../api/userapi";
import eye1 from "../assets/eye-outline.256x178.png";
import { useDispatch } from "react-redux";
import { addUser } from "../Redux/userslice";
import { FiLoader } from "react-icons/fi";
import GoogleButton from "../components/miscellaneous/GoogleButton";

function Signin() {
  const useLocal = import.meta.env.VITE_USE_LOCAL === "false";
  const host = useLocal
    ? import.meta.env.VITE_LOCAL_URL
    : import.meta.env.VITE_SERVER_URL;

  const [usernameOrEmail, setUsernameOrEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  function saveUserSessiondata(userData) {
    sessionStorage.setItem("user", JSON.stringify(userData));
  }

  function saveUserSessiontoken(token) {
    sessionStorage.setItem("token", token);
  }

  const googleLogin = async () => {
    const loadingToast = toast.loading("Logging in with Google...", {
      position: "top-center",
    });
    try {
      window.open(`${host}/auth/google`, "_self");
    } catch (error) {
      toast.dismiss(loadingToast);
      toast.error("Google Login Failed, please try again.", {
        duration: 3000,
        position: "top-center",
      });
      setTimeout(() => navigate("/"), 3000);
    }
  };

  const handleLogin = async (e) => {
    e.preventDefault();
    setIsLoading(true); // Set loading to true
    const loadingToast = toast.loading("Logging in...", {
      position: "top-center",
    });
    const formattedUsernameOrEmail = usernameOrEmail.toLowerCase();
    try {
      const response = await login(formattedUsernameOrEmail, password);
      toast.dismiss(loadingToast);
      setIsLoading(false); // Set loading to false after response
      if (
        response.status === 200 &&
        response.data.message === "Login successful"
      ) {
        localStorage.setItem("token", response.data.token);
        localStorage.setItem("user", JSON.stringify(response.data.user));
        dispatch(addUser(response.data.user));
        await saveUserSessiondata(response.data.user);
        await saveUserSessiontoken(response.data.token);

        toast.success("Login successful!", {
          duration: 3000,
          position: "top-center",
        });
        setTimeout(() => {
          navigate("/");
          // window.location.reload();
        }, 3000);
      } else if (
        response.status === 200 &&
        response.data.message === "OTP sent for email verification"
      ) {
        const tokengot = response.data.token;
        toast.success("OTP verification required!", {
          duration: 3000,
          position: "top-center",
        });
        setTimeout(
          () =>
            navigate("/verify-otp", {
              state: { token: tokengot },
            }),
          3000
        );
      } else if (
        response.status === 200 &&
        response.data.message === "2FA OTP required"
      ) {
        const tokengot = response.data.token;
        toast.success("2FA OTP verification required!", {
          duration: 3000,
          position: "top-center",
        });
        setTimeout(
          () =>
            navigate("/verify-2fa", {
              state: { token: tokengot },
            }),
          3000
        );
      } else {
        toast.error(
          response.data.message ||
            "Login failed. Please check your credentials.",
          {
            duration: 3000,
            position: "top-center",
          }
        );
      }
    } catch (error) {
      toast.dismiss(loadingToast);
      setIsLoading(false); // Set loading to false if error occurs
      if (error.response) {
        toast.error(
          error.response.data.message ||
            "Login failed. Please check your credentials.",
          {
            duration: 3000,
            position: "top-center",
          }
        );
      } else {
        toast.error("Login Failed, please try again.", {
          duration: 3000,
          position: "top-center",
        });
      }
    }
  };

  return (
    <div>
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-orange-100 to-gray-100">
        <div className="w-full max-w-lg p-6">
          <form
            className="bg-white dark:bg-gray-800 rounded-lg shadow-lg p-6"
            onSubmit={handleLogin}
          >
            <h1 className="text-lg text-center font-semibold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 dark:from-orange-400 dark:to-yellow-400">
              Sign In to Your Account
            </h1>
            <div className="flex justify-center">
              <lord-icon
                src="https://cdn.lordicon.com/bbnkwdur.json"
                trigger="loop"
                colors="primary:#f57c00,secondary:#ffcc00"
                style={{ width: "100px", height: "100px" }}
              ></lord-icon>
            </div>
            <div className="mb-5">
              <label
                htmlFor="username"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Username or Email <span className="text-red-600">*</span>
              </label>
              <input
                type="text"
                id="username"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                placeholder="Username or Email"
                required
                onChange={(e) => setUsernameOrEmail(e.target.value)}
              />
            </div>

            <div className="relative mb-5">
              <div className="flex justify-between items-center">
                <label
                  htmlFor="password"
                  className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
                >
                  Password
                </label>
                <Link
                  to="/forgot-password"
                  className="text-sm text-orange-400 hover:underline dark:text-blue-500"
                >
                  Forgot Password?
                </Link>
              </div>

              <div className="relative">
                <input
                  type={showPassword ? "text" : "password"}
                  id="password"
                  placeholder="Enter Password"
                  className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                  required
                  onChange={(e) => setPassword(e.target.value)}
                />

                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute inset-y-0 right-0 flex items-center pr-3 mt-0"
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
            </div>
            <button
              type="submit"
              className="inline-flex w-full items-center justify-center text-white bg-gradient-to-r from-orange-500 to-yellow-500 border-2 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition transform hover:-translate-y-1 hover:scale-105 shadow-lg"
              disabled={isLoading}
            >
              {isLoading ? (
                <>
                  Signing in
                  <FiLoader className="animate-spin ml-2" />
                </>
              ) : (
                "Sign In"
              )}
            </button>

            <p className="text-sm font-light text-center text-gray-500 dark:text-gray-400 mt-4">
              Don't have an account?{" "}
              <Link
                to="/signup"
                className="font-medium text-orange-400 hover:underline dark:text-blue-500"
              >
                Sign Up
              </Link>
            </p>
            <div className="mt-1 text-center">
              <div className="signin-other-title">
                <h5 className="text-md font-bold text-center text-gray-500 dark:text-gray-400 mt-1 mb-2">
                  or
                </h5>
              </div>
              <div className="space-x-2 flex flex-row items-center justify-center">
                {/* google */}
                <GoogleButton onClick={googleLogin}>
                  {" "}
                  Sign In with Google
                </GoogleButton>
              </div>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}

export default Signin;
