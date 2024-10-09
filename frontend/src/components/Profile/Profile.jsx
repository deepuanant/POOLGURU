import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import { useNavigate } from "react-router-dom";
import HeatmapChart from "./HeatMap";
import {
  loginotpstate,
  enable2fa,
  disable2fa,
  verify2faOtp,
  removeProfilePhoto,
  removeCoverPhoto,
} from "../../api/userapi";
import { addUser } from "../../Redux/userslice";

const defaultProfileImage = "path/to/defaultProfileImage.png";
const defaultCoverImage = "path/to/defaultCoverImage.png";

function Profile() {
  const dispatch = useDispatch();
  const navigate = useNavigate();
  const userData = useSelector((state) => state.profile);

  // console.log(userData, "userData");

  const [otp, setOtp] = useState("");
  const [loading, setLoading] = useState(false);
  const [userdata, setUserdata] = useState({
    firstname: userData.firstname,
    lastname: userData.lastname,
    email: userData.email,
    about: userData.about,
    mobileno: userData.mobileno,
    designation: userData.designation,
    location: userData.location,
    companyname: userData.companyname,
    profilePhoto: userData.profilephoto || defaultProfileImage,
    profilePhotopreview: userData.profilephoto || defaultProfileImage,
    coverphoto: userData.coverphoto || defaultCoverImage,
    coverphotopreview: userData.coverphoto || defaultCoverImage,
  });

  const [profile, setProfile] = useState({
    username: userData.username,
    twoFactorEnabled: userData.twoFactorEnabled,
    verified2fa: userData.verified2fa,
    otpVerify: userData.otpVerify,
  });

  const [qrImage, setQrImage] = useState(userData.twofactorqr);
  const [showOtpSection, setShowOtpSection] = useState(false); // New state for OTP section visibility

  useEffect(() => {
    const loadUserData = () => {
      const storedUserData = userData;
      // console.log(storedUserData, "storedUserData");
      if (storedUserData) {
        setUserdata({
          firstname: storedUserData.firstname,
          lastname: storedUserData.lastname,
          email: storedUserData.email,
          about: storedUserData.about,
          mobileno: storedUserData.mobileno,
          designation: storedUserData.designation,
          location: storedUserData.location,
          companyname: storedUserData.companyname,
          profilePhoto: storedUserData.profilephoto || defaultProfileImage,
          profilePhotopreview:
            storedUserData.profilephoto || defaultProfileImage,
          coverphoto: storedUserData.coverphoto || defaultCoverImage,
          coverphotopreview: storedUserData.coverphoto || defaultCoverImage,
        });
        setProfile({
          username: storedUserData.username,
          twoFactorEnabled: storedUserData.twoFactorEnabled,
          verified2fa: storedUserData.verified2fa,
          otpVerify: storedUserData.otpVerify,
        });
        setQrImage(storedUserData.twofactorqr);
      }
    };

    loadUserData();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserdata((prevuserdata) => ({
      ...prevuserdata,
      [name]: value,
    }));
  };

  const updatestate = async (user) => {
    try {
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(addUser(user));
    } catch (error) {
      console.log(error);
    }
  };

  const handle2FAToggle = async () => {
    if (!profile.otpVerify) {
      toast.error("Please enable OTP verification for login first.");
      return;
    }

    setLoading(true);
    setProfile((prevProfile) => ({
      ...prevProfile,
      twoFactorEnabled: !prevProfile.twoFactorEnabled,
    }));

    try {
      const response = profile.twoFactorEnabled
        ? await disable2fa()
        : await enable2fa();

      if (response.status === 200) {
        toast.success(response.data.message);
        await updatestate(response.data.user);
        if (!profile.twoFactorEnabled && response.data.qrCodeUrl) {
          setQrImage(response.data.qrCodeUrl);
          setShowOtpSection(true); // Show OTP section when enabling 2FA
        } else {
          setShowOtpSection(false); // Hide OTP section when disabling 2FA
        }
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handle2FALoginToggle = async () => {
    setLoading(true);
    const newOtpVerifyState = !profile.otpVerify;
    setProfile((prevProfile) => ({
      ...prevProfile,
      otpVerify: newOtpVerifyState,
    }));

    const data = {
      otpVerify: newOtpVerifyState,
    };

    try {
      if (!profile.twoFactorEnabled) {
        const response = await loginotpstate(data);
        await updatestate(response.data.user);

        if (response.status === 200) {
          toast.success(response.data.message);
        } else {
          toast.error(response.data.message);
        }
      } else {
        toast.error("You cannot disable this as 2FA is enabled");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
  };

  const handleOtpVerification = async () => {
    setLoading(true);
    try {
      const response = await verify2faOtp(otp);
      if (response.status === 200) {
        toast.success(response.data.message);
        await updatestate(response.data.user);
        setShowOtpSection(false); // Hide OTP section after successful verification
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    setLoading(true);
    try {
      const response = await removeProfilePhoto();
      if (response.status === 200) {
        toast.success(response.data.message);
        await updatestate(response.data.user);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleCoverDelete = async () => {
    setLoading(true);
    try {
      const response = await removeCoverPhoto();
      if (response.status === 200) {
        toast.success(response.data.message);
        await updatestate(response.data.user);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    } finally {
      setLoading(false);
    }
  };

  const handleNavigateToSettings = () => {
    navigate("/setting");
  };

  return (
    <div className="p-4 bg-white min-h-screen">
      <div className="grid grid-cols-1 gap-4 lg:grid-cols-3 lg:gap-8">
        <div className="rounded-lg">
          <div className="bg-white border border-gray-200 rounded-lg shadow-lg dark:bg-gray-800 dark:border-gray-700">
            <div className="flex flex-col items-center p-6">
              <img
                className="w-24 h-24 mb-3 rounded-full shadow-lg"
                src={userdata.profilePhotopreview}
                alt="Profile"
              />
              <h5 className="text-xl font-medium text-gray-900 dark:text-white">
                {userdata.firstname} {userdata.lastname}
              </h5>
              <span className="text-sm text-gray-500 dark:text-gray-400">
                {userdata.designation}
              </span>
            </div>
            <div className="text-sm text-gray-900 p-6 dark:text-gray-200">
              <p>Location: {userdata.location}</p>
              <p>Email: {userdata.email}</p>
              <p>Phone: {userdata.mobileno}</p>
            </div>
            {/* Two-Factor Authentication Section */}
            <div className="flex justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Two-Factor Authentication
              </span>
              <button
                onClick={handle2FAToggle}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ${
                  profile.twoFactorEnabled ? "bg-blue-500" : "bg-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={profile.twoFactorEnabled}
                  readOnly
                />
                <span
                  className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 transform ${
                    profile.twoFactorEnabled ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* Enable OTP for Login Section */}
            <div className="flex justify-between px-4 py-2 border-t border-gray-200 dark:border-gray-700">
              <span className="text-sm font-medium text-gray-900 dark:text-white">
                Enable OTP for Login
              </span>
              <button
                onClick={handle2FALoginToggle}
                className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ${
                  profile.otpVerify ? "bg-blue-500" : "bg-gray-200"
                }`}
              >
                <input
                  type="checkbox"
                  className="sr-only"
                  checked={profile.otpVerify}
                  readOnly
                />
                <span
                  className={`absolute left-0.5 top-0.5 w-5 h-5 bg-white rounded-full shadow transition-transform duration-200 transform ${
                    profile.otpVerify ? "translate-x-5" : "translate-x-0"
                  }`}
                />
              </button>
            </div>

            {/* QR Code Section */}
            {qrImage &&
              !profile.verified2fa &&
              showOtpSection && ( // Check showOtpSection
                <div className="p-4 border-t border-gray-200 dark:border-gray-700">
                  <p className="text-gray-700 text-sm mb-2 dark:text-gray-300">
                    Please scan this QR code with your authenticator app to
                    enable two-factor authentication:
                  </p>
                  <img src={qrImage} alt="QR Code" className="mt-2 mx-auto" />
                  <input
                    type="text"
                    placeholder="Enter OTP"
                    value={otp}
                    onChange={handleOtpChange}
                    className="mt-2 px-4 py-2 border rounded-md text-sm w-full"
                  />
                  <button
                    onClick={handleOtpVerification}
                    className="mt-2 bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md text-sm transition transform hover:-translate-y-1"
                  >
                    Verify OTP
                  </button>
                </div>
              )}
          </div>
        </div>

        <div className="h-full rounded-lg bg-white lg:col-span-2 shadow-lg">
          <div className="p-6 bg-white rounded-lg">
            <h2 className="text-2xl font-semibold mb-4 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
              General Information
            </h2>
            <div className="mb-6">
              <h3 className="text-xl font-semibold">About Me</h3>
              <p className="text-gray-600 mt-2">{userdata.about}</p>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <p className="text-gray-800 font-semibold">Location</p>
                <p className="text-gray-600">{userdata.location}</p>
              </div>
              <div>
                <p className="text-gray-800 font-semibold">Designation</p>
                <p className="text-gray-600">{userdata.designation}</p>
              </div>
              <div>
                <p className="text-gray-800 font-semibold">Company Name</p>
                <p className="text-gray-600">{userdata.companyname}</p>
              </div>
            </div>
            <div className="mt-4">
              <HeatmapChart />
            </div>
          </div>
        </div>
      </div>
      <div className="flex justify-end px-4 pt-4">
        <button
          onClick={handleNavigateToSettings}
          className="text-white bg-gradient-to-r from-orange-500 to-yellow-500 border-2 p-2 rounded-lg px-3 font-medium text-sm dark:text-orange-400 dark:hover:text-orange-500 transition duration-300 cursor-pointer transition-transform transform hover:scale-105"
        >
          Edit
        </button>
      </div>
    </div>
  );
}

export default Profile;
