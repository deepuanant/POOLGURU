import React, { useState } from "react";
import { toast } from "react-hot-toast";
// import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";
import png1 from "../assets/PoolGuru_Logo.png";
import eye1 from "../assets/eye-outline.256x178.png";
import { useParams } from "react-router-dom";
import { changepassword } from "../api/userapi";

function Changepassword() {
  const [password, setPassword] = useState("");
  const [repeatPassword, setRepeatPassword] = useState("");
  const [showRepeatPasswordAlert, setShowRepeatPasswordAlert] = useState(false);
  const [repeatPasswordTouched, setRepeatPasswordTouched] = useState(false);
  const [passwordRequirements, setPasswordRequirements] = useState({
    length: false,
    lower: false,
    upper: false,
    number: false,
    special: false,
  });
  const [showPassword, setShowPassword] = useState(false);
  const resetToken = useParams().token;
  // console.log(resetToken);

  const navigate = useNavigate();

  // Handler for password input changes
  const handlePasswordChange = (e) => {
    const value = e.target.value;
    setPassword(value);
    validatePassword(value); // Validate password when it changes
    setShowRepeatPasswordAlert(false); // Hide the repeat password alert when the password changes
  };

  // Handler for repeat password input changes
  const handleRepeatPasswordChange = (e) => {
    const value = e.target.value;
    setRepeatPassword(value);
    setRepeatPasswordTouched(true);
    // Check if the repeat password matches the original password
    if (password && value !== password) {
      setShowRepeatPasswordAlert(true);
    } else {
      setShowRepeatPasswordAlert(false);
    }
  };

  // Handler for form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const loadintest = toast.loading("Changing Password...", {
      position: "top-center",
    });

    // Basic validation
    if (password !== repeatPassword) {
      setShowRepeatPasswordAlert(true);
      return;
    }

    try {
      const response = await changepassword(password, resetToken);
      if (response.status === 200) {
        toast.success("Password changed successfully.", {
          id: loadintest,
          duration: 5000,
          position: "top-center",
        });

        setTimeout(() => navigate("/login"), 5000);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message || "Something went Wrong.", {
          id: loadintest,
          duration: 5000,
          position: "top-center",
        });
      } else {
        toast.error("Something went Wrong.", {
          id: loadintest,
          duration: 5000,
          position: "top-center",
        });
      }
    }
  };

  // Function to validate password
  const validatePassword = (value) => {
    setPasswordRequirements({
      length: value.length >= 8,
      lower: /[a-z]/.test(value),
      upper: /[A-Z]/.test(value),
      number: /[0-9]/.test(value),
      special: /[!@#?$%^&*()_+{}[\]:;"'<>,./\\|`~]/.test(value),
    });
  };

  return (
    <div>
      <div className="min-h-screen bg-gradient-to-r from-orange-100 to-gray-100">
        <div className="w-screen-xl justify-content-center m-auto p-20">
          <form
            className="max-w-lg mx-auto border p-3 bg-white dark:bg-gray-800 rounded-lg"
            onSubmit={handleSubmit}
          >
            <img src={png1} alt="" className="w-24  m-auto py-3" />
            <h1 className="text-lg font-semibold text-center mb-3 leading-tight tracking-tight text-orange-600 md:text-lg dark:text-white">
              Create New Password
            </h1>
            <p className="text-slate-400 text-sm   text-center">
              Your new password must be different from previous password.
            </p>
            <br />

            <div className="relative mb-5">
              <label
                htmlFor="password"
                className="block mb-2 text-sm font-medium text-gray-900 dark:text-white"
              >
                Password
              </label>
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 top-5 flex items-center pl-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="20"
                    height="20"
                    viewBox="0 0 50 50"
                    className="text-gray-500 dark:text-gray-400"
                  >
                    <path d="M 25 2 C 17.832484 2 12 7.8324839 12 15 L 12 21 L 8 21 C 6.3550302 21 5 22.35503 5 24 L 5 47 C 5 48.64497 6.3550302 50 8 50 L 42 50 C 43.64497 50 45 48.64497 45 47 L 45 24 C 45 22.35503 43.64497 21 42 21 L 38 21 L 38 15 C 38 7.8324839 32.167516 2 25 2 z M 25 4 C 31.086484 4 36 8.9135161 36 15 L 36 21 L 14 21 L 14 15 C 14 8.9135161 18.913516 4 25 4 z M 8 23 L 42 23 C 42.56503 23 43 23.43497 43 24 L 43 47 C 43 47.56503 42.56503 48 42 48 L 8 48 C 7.4349698 48 7 47.56503 7 47 L 7 24 C 7 23.43497 7.4349698 23 8 23 z M 13 34 A 2 2 0 0 0 11 36 A 2 2 0 0 0 13 38 A 2 2 0 0 0 15 36 A 2 2 0 0 0 13 34 z M 21 34 A 2 2 0 0 0 19 36 A 2 2 0 0 0 21 38 A 2 2 0 0 0 23 36 A 2 2 0 0 0 21 34 z M 29 34 A 2 2 0 0 0 27 36 A 2 2 0 0 0 29 38 A 2 2 0 0 0 31 36 A 2 2 0 0 0 29 34 z M 37 34 A 2 2 0 0 0 35 36 A 2 2 0 0 0 37 38 A 2 2 0 0 0 39 36 A 2 2 0 0 0 37 34 z" />
                  </svg>
                </div>
              </div>
              <input
                type={showPassword ? "text" : "password"}
                id="password-input"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
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
                  <img src={eye1} alt="" className="w-6" />
                ) : (
                  <div>
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
                  </div>
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
              <div className="relative">
                <div className="pointer-events-none absolute inset-y-0 left-0 top-5 flex items-center pl-3">
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    x="0px"
                    y="0px"
                    width="20"
                    height="20"
                    viewBox="0 0 50 50"
                    className="text-gray-500 dark:text-gray-400"
                  >
                    <path d="M 25 2 C 17.832484 2 12 7.8324839 12 15 L 12 21 L 8 21 C 6.3550302 21 5 22.35503 5 24 L 5 47 C 5 48.64497 6.3550302 50 8 50 L 42 50 C 43.64497 50 45 48.64497 45 47 L 45 24 C 45 22.35503 43.64497 21 42 21 L 38 21 L 38 15 C 38 7.8324839 32.167516 2 25 2 z M 25 4 C 31.086484 4 36 8.9135161 36 15 L 36 21 L 14 21 L 14 15 C 14 8.9135161 18.913516 4 25 4 z M 8 23 L 42 23 C 42.56503 23 43 23.43497 43 24 L 43 47 C 43 47.56503 42.56503 48 42 48 L 8 48 C 7.4349698 48 7 47.56503 7 47 L 7 24 C 7 23.43497 7.4349698 23 8 23 z M 13 34 A 2 2 0 0 0 11 36 A 2 2 0 0 0 13 38 A 2 2 0 0 0 15 36 A 2 2 0 0 0 13 34 z M 21 34 A 2 2 0 0 0 19 36 A 2 2 0 0 0 21 38 A 2 2 0 0 0 23 36 A 2 2 0 0 0 21 34 z M 29 34 A 2 2 0 0 0 27 36 A 2 2 0 0 0 29 38 A 2 2 0 0 0 31 36 A 2 2 0 0 0 29 34 z M 37 34 A 2 2 0 0 0 35 36 A 2 2 0 0 0 37 38 A 2 2 0 0 0 39 36 A 2 2 0 0 0 37 34 z" />
                  </svg>
                </div>
              </div>
              <input
                type="password"
                id="confirm-password-input"
                className="block w-full rounded-lg border border-gray-300 bg-gray-50 p-2.5 pl-10 text-sm text-gray-900 focus:border-blue-500 focus:ring-blue-500 dark:border-gray-600 dark:bg-gray-700 dark:text-white dark:placeholder-gray-400 dark:focus:border-blue-500 dark:focus:ring-blue-500"
                required
                onChange={handleRepeatPasswordChange}
                onBlur={() => setRepeatPasswordTouched(true)} // Ensure alert shows after interacting with this field
              />
            </div>

            <div
              id="password-contain"
              className="p-3 bg-gray-200 mb-2 rounded "
              style={{ display: "none" }}
            >
              <h5 className="fs-10">Password must contain:</h5>
              <p
                className={`fs-8 mb-2 ${
                  passwordRequirements.length
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {passwordRequirements.length ? "✓" : "X"} Minimum{" "}
                <b>8 characters</b>
              </p>
              <p
                className={`fs-8 mb-2 ${
                  passwordRequirements.lower ? "text-green-600" : "text-red-600"
                }`}
              >
                {passwordRequirements.lower ? "✓" : "X"} At least one{" "}
                <b>lowercase</b> letter (a-z)
              </p>
              <p
                className={`fs-8 mb-2 ${
                  passwordRequirements.upper ? "text-green-600" : "text-red-600"
                }`}
              >
                {passwordRequirements.upper ? "✓" : "X"} At least one{" "}
                <b>uppercase</b> letter (A-Z)
              </p>
              <p
                className={`fs-8 mb-2 ${
                  passwordRequirements.number
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {passwordRequirements.number ? "✓" : "X"} At least one{" "}
                <b>number</b> (0-9)
              </p>
              <p
                className={`fs-8 mb-0 ${
                  passwordRequirements.special
                    ? "text-green-600"
                    : "text-red-600"
                }`}
              >
                {passwordRequirements.special ? "✓" : "X"} Inclusion of at least
                one <b>special character</b>, e.g., ! @ # ?
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

            <button
              type="submit"
              className="inline-flex w-full items-center justify-center text-white bg-gradient-to-r from-orange-500 to-yellow-500 border-2 font-medium rounded-lg text-sm px-5 py-2.5 dark:bg-blue-600 dark:hover:bg-blue-700 dark:focus:ring-blue-800 transition transform hover:-translate-y-1 hover:scale-105 shadow-lg"
            >
              Change Password
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

export default Changepassword;
