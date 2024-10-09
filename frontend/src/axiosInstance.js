import axios from "axios";
import { store } from "./Redux/store"; // Import your Redux store
import { clearUser } from "./Redux/userslice"; // Import the clearUser action
import toast from "react-hot-toast";

// Create an Axios instance
const axiosInstance = axios.create({
  baseURL: process.env.REACT_APP_API_URL, // Your API URL
});

// Add a response interceptor
axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response && error.response.status === 401) {
      // If 401 is received (token expired), log out the user
      store.dispatch(clearUser());
      toast.error("session expiry")
    }
    return Promise.reject(error);
  }
);

export default axiosInstance;
