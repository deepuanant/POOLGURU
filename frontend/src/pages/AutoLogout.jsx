import { useEffect } from 'react';
import { useDispatch } from 'react-redux';
import {jwtDecode} from 'jwt-decode';
import { clearUser } from '../Redux/userslice';
import { toast } from 'react-hot-toast';
import { useNavigate } from 'react-router-dom';

const AutoLogout = () => {
  const dispatch = useDispatch();
  const navigate = useNavigate(); // Initialize navigate

  async function deletePayoutDatabaseIfExists() {
    return new Promise((resolve, reject) => {
      const openRequest = indexedDB.open("PayoutData");

      openRequest.onsuccess = function (event) {
        const db = event.target.result;
        db.close();

        const deleteRequest = indexedDB.deleteDatabase("PayoutData");

        deleteRequest.onsuccess = function () {
          // console.log("PayoutData database deleted successfully.");
          resolve();
        };

        deleteRequest.onerror = function (event) {
          console.error("Error deleting PayoutData database:", event);
          reject(event);
        };

        deleteRequest.onblocked = function () {
          console.warn("Deletion of PayoutData database is blocked.");
          reject(new Error("Deletion blocked"));
        };
      };

      openRequest.onerror = function (event) {
        console.warn("PayoutData database does not exist or cannot be opened.");
        resolve();
      };
    });
  }

  useEffect(() => {
    const token = localStorage.getItem('token');

    if (token) {
      const decodedToken = jwtDecode(token);
      const expirationTime = decodedToken.exp * 1000 - Date.now();

      // Check if token is already expired
      if (expirationTime <= 0) {
        handleLogout(); // Immediate logout if expired
      } else {
        // Set a timeout to log out user when token expires
        const timer = setTimeout(() => {
          handleLogout();
        }, expirationTime);

        return () => clearTimeout(timer);
      }
    }

    async function handleLogout() {
      dispatch(clearUser());
      localStorage.removeItem('token');

      try {
        await deletePayoutDatabaseIfExists();
      } catch (error) {
        console.error("Failed to clear IndexedDB", error);
      }

      toast.success("Logged out successfully", { position: "top-center" });

      // Navigate to the login page or home page to reset the state
      navigate("/login", { replace: true });
    }
  }, [dispatch, navigate]);

  return null;
};

export default AutoLogout;
