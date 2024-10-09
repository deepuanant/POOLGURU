import React, { useState, useEffect } from "react";
import { useSelector, useDispatch } from "react-redux";
import { toast } from "react-hot-toast";
import bgCover from "../../assets/profile-bg.jpg";
import {
  loginotpstate,
  enable2fa,
  disable2fa,
  verify2faOtp,
  updateuser,
  removeProfilePhoto,
  removeCoverPhoto,
} from "../../api/userapi";
import LoadingSpinner from "./Loadingspinner";
// import Profile from "../Profile/Profile";
// const { addUser } = require("../../Redux/userslice");
import { addUser } from "../../Redux/userslice";

const defaultProfileImage = "https://via.placeholder.com/150";
const defaultCoverImage = bgCover;

const ProfilePage = () => {
  const dispatch = useDispatch();
  const [otp, setOtp] = useState("");
  const [user, setUser] = useState(useSelector((state) => state.user));
  const [qrImage, setQrImage] = useState(user.twofactorqr);
  const [loading, setLoading] = useState(false);
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [isCoverModalOpen, setIsCoverModalOpen] = useState(false);
  const [isEditMode, setIsEditMode] = useState(false);

  const [profile, setProfile] = useState({
    username: user.username,
    twoFactorEnabled: user.twoFactorEnabled,
    verified2fa: user.verified2fa,
    otpVerify: user.otpVerify,
  });

  const [userdata, setUserdata] = useState({
    firstname: user.firstname,
    lastname: user.lastname,
    email: user.email,
    about: user.about,
    mobileno: user.mobileno,
    designation: user.designation,
    location: user.location,
    companyname: user.companyname,
    profilePhoto: user.profilephoto || defaultProfileImage,
    profilePhotopreview: user.profilephoto || defaultProfileImage,
    coverphoto: user.coverphoto || defaultCoverImage,
    coverphotopreview: user.coverphoto,
  });

  useEffect(() => {
    setProfile({
      username: user.username,
      twoFactorEnabled: user.twoFactorEnabled,
      verified2fa: user.verified2fa,
      otpVerify: user.otpVerify,
    });
    setUserdata({
      firstname: user.firstname,
      lastname: user.lastname,
      email: user.email,
      about: user.about,
      mobileno: user.mobileno,
      designation: user.designation,
      location: user.location,
      companyname: user.companyname,
      profilePhoto: user.profilephoto || defaultProfileImage,
      profilePhotopreview: user.profilephoto || defaultProfileImage,
      coverphoto: user.coverphoto || defaultCoverImage,
      coverphotopreview: user.coverphoto,
    });

    setQrImage(user.twofactorqr);
  }, [user]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserdata((prevuserdata) => ({
      ...prevuserdata,
      [name]: value,
    }));
  };

  const updatestate = async (user) => {
    try {
      setUser(user);
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(addUser(user));
    } catch (error) {
      console.log(error);
    }
  };

  const handle2FAToggle = async () => {
    try {
      if (profile.otpVerify) {
        setLoading(true);
        setProfile((prevProfile) => ({
          ...prevProfile,
          twoFactorEnabled: !prevProfile.twoFactorEnabled,
        }));

        const response = profile.twoFactorEnabled
          ? await disable2fa()
          : await enable2fa();

        if (response.status === 200) {
          toast.success(response.data.message);
          await updatestate(response.data.user);
          if (!profile.twoFactorEnabled && response.data.qrCodeUrl) {
            setQrImage(response.data.qrCodeUrl);
          }
        } else {
          toast.error(response.data.message);
        }
      } else {
        toast.error("Please enable OTP verification for login first.");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
    setLoading(false);
  };

  const handle2FALoginToggle = async () => {
    setLoading(true);
    const data = {
      otpVerify: !profile.otpVerify,
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
    }
    setLoading(false);
  };

  const handleOtpChange = (e) => {
    setOtp(e.target.value);
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
    }
    setLoading(false);
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
    }
    setLoading(false);
  };

  const handleOtpVerification = async () => {
    setLoading(true);
    const response = await verify2faOtp(otp);
    try {
      if (response.status === 200) {
        toast.success(response.data.message);
        await updatestate(response.data.user);
      } else {
        toast.error("Something went wrong. Please try again.");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
    setLoading(false);
  };

  const handleUpdate = async () => {
    setLoading(true);
    try {
      const formData = new FormData();

      if (userdata.firstname) formData.append("firstname", userdata.firstname);
      if (userdata.lastname) formData.append("lastname", userdata.lastname);
      if (userdata.email) formData.append("email", userdata.email);
      if (userdata.about) formData.append("about", userdata.about);
      if (userdata.mobileno) formData.append("mobileno", userdata.mobileno);
      if (userdata.designation)
        formData.append("designation", userdata.designation);
      if (userdata.location) formData.append("location", userdata.location);
      if (userdata.companyname)
        formData.append("companyname", userdata.companyname);
      if (userdata.profilePhoto instanceof File) {
        formData.append("profilePhoto", userdata.profilePhoto);
      }
      if (userdata.coverphoto instanceof File) {
        formData.append("coverphoto", userdata.coverphoto);
      }

      const response = await updateuser(formData);
      await updatestate(response.data.user);

      if (response.status === 200) {
        toast.success(response.data.message);
        setIsEditMode(false);
      } else {
        toast.error(response.data.message);
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
    setLoading(false);
  };

  const calculateProgress = () => {
    const fields = [
      userdata.firstname,
      userdata.lastname,
      userdata.email,
      userdata.about,
      userdata.mobileno,
      userdata.designation,
      userdata.location,
      userdata.companyname,
    ];
    const filledFields = fields.filter(
      (field) => field && field.trim() !== ""
    ).length;
    return (filledFields / fields.length) * 100;
  };

  const renderField = (label, name, value) => (
    <div className="grid grid-cols-2">
      <div className="px-4 py-2 font-semibold text-sm">{label}</div>
      {isEditMode ? (
        <input
          type="text"
          name={name}
          value={value}
          onChange={handleChange}
          className="px-4 py-2 border rounded-md text-sm"
        />
      ) : (
        <div className="px-4 py-2 text-sm">{value}</div>
      )}
    </div>
  );

  return (
    <div className="min-h-screen bg-gray-100">
      {loading && <LoadingSpinner />}
      <div className="container mx-auto py-10 max-w-3xl">
        <div className="md:flex md:-mx-2">
          {/* Profile Section */}
          <div className="w-full md:w-12/12 mx-2">
            <div className="relative bg-white border rounded-lg mb-10">
              <div className="relative w-full h-48">
                <img
                  className="w-full h-full object-cover rounded-lg"
                  src={userdata.coverphotopreview}
                  alt="Cover"
                />
                <button
                  className="absolute bottom-1 right-0 bg-white p-1 rounded-full shadow-md text-gray-600 hover:text-gray-800"
                  onClick={() => {
                    setIsCoverModalOpen(true);
                    setIsEditMode(true);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </button>
              </div>
              <div className="absolute left-20 top-1/2 transform -translate-x-1/2 -translate-y-1/2 w-32 h-32">
                <img
                  className="w-full h-full rounded-full object-cover border-4"
                  src={userdata.profilePhotopreview}
                  alt="Profile"
                />
                <button
                  className="absolute bottom-0 right-0 bg-white p-1 rounded-full shadow-md text-gray-600 hover:text-gray-800"
                  onClick={() => {
                    setIsModalOpen(true);
                    setIsEditMode(true);
                  }}
                >
                  <svg
                    xmlns="http://www.w3.org/2000/svg"
                    fill="none"
                    viewBox="0 0 24 24"
                    strokeWidth={1.5}
                    stroke="currentColor"
                    className="w-5 h-5"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L10.582 16.07a4.5 4.5 0 01-1.897 1.13L6 18l.8-2.685a4.5 4.5 0 011.13-1.897l8.932-8.931zm0 0L19.5 7.125M18 14v4.75A2.25 2.25 0 0115.75 21H5.25A2.25 2.25 0 013 18.75V8.25A2.25 2.25 0 015.25 6H10"
                    />
                  </svg>
                </button>
              </div>
            </div>

            {/* Progress Bar */}
            <div className="bg-white p-4 shadow-sm rounded-lg mb-4">
              <div className="font-semibold text-gray-900 text-md mb-2">
                Profile Completion
              </div>
              <div className="w-full bg-gray-200 rounded-full h-2.5 mb-4">
                <div
                  className="bg-blue-600 h-2.5 rounded-full"
                  style={{ width: `${calculateProgress()}%` }}
                ></div>
              </div>
            </div>

            {/* Profile Information */}
            <div className="bg-white p-4 shadow-sm rounded-lg">
              <div className="font-semibold text-gray-900 text-md mb-4">
                Profile
              </div>
              <div className="text-gray-700">
                <div className="grid md:grid-cols-2 gap-4">
                  {renderField("First Name", "firstname", userdata.firstname)}
                  {renderField("Last Name", "lastname", userdata.lastname)}
                  {renderField("Email", "email", userdata.email)}
                  {renderField("Mobile No", "mobileno", userdata.mobileno)}
                  {renderField(
                    "Designation",
                    "designation",
                    userdata.designation
                  )}
                  {renderField("Location", "location", userdata.location)}
                  {renderField(
                    "Company Name",
                    "companyname",
                    userdata.companyname
                  )}
                </div>
                <div className="flex items-center mt-5">
                  <div className="px-4 font-semibold text-sm mr-4">About</div>
                  {isEditMode ? (
                    <textarea
                      name="about"
                      value={userdata.about}
                      onChange={handleChange}
                      className="px-4 py-2 border rounded-md text-sm flex-grow"
                    />
                  ) : (
                    <div className="px-4 py-2 text-sm flex-grow">
                      {userdata.about}
                    </div>
                  )}
                </div>

                <div className="grid md:grid-cols-2 gap-4 mt-4">
                  {/* Two-Factor Authentication */}
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold text-sm">
                      Two-Factor Authentication
                    </div>
                    <div className="px-4 py-2 flex items-center">
                      <span className="mr-2 text-sm">Off</span>
                      <button
                        onClick={handle2FAToggle}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ${
                          profile.twoFactorEnabled
                            ? "bg-orange-200"
                            : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`${
                            profile.twoFactorEnabled
                              ? "translate-x-6"
                              : "translate-x-1"
                          } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200`}
                        />
                      </button>
                      <span className="ml-2 text-sm">On</span>
                    </div>
                  </div>
                  {/* Enable OTP for Login */}
                  <div className="grid grid-cols-2">
                    <div className="px-4 py-2 font-semibold text-sm">
                      Enable OTP for Login
                    </div>
                    <div className="px-4 py-2 flex items-center">
                      <span className="mr-2 text-sm">Off</span>
                      <button
                        onClick={handle2FALoginToggle}
                        className={`relative inline-flex items-center h-6 rounded-full w-11 transition-colors duration-200 ${
                          profile.otpVerify ? "bg-orange-200" : "bg-gray-200"
                        }`}
                      >
                        <span
                          className={`${
                            profile.otpVerify
                              ? "translate-x-6"
                              : "translate-x-1"
                          } inline-block w-4 h-4 transform bg-white rounded-full transition-transform duration-200`}
                        />
                      </button>
                      <span className="ml-2 text-sm">On</span>
                    </div>
                  </div>
                </div>
                {/* QR Code Section */}
                {qrImage && !profile.verified2fa && (
                  <div className="mt-4">
                    <p className="text-gray-700 text-sm">
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
                      className="mt-2 bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
                    >
                      Verify OTP
                    </button>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
        <div className="mt-4 flex justify-end">
          {isEditMode ? (
            <>
              <button
                onClick={() => setIsEditMode(false)}
                className="bg-gray-500 text-white px-4 py-2 rounded-md text-sm mr-2"
              >
                Cancel
              </button>
              <button
                onClick={handleUpdate}
                className="bg-green-600 text-white px-4 py-2 rounded-md text-sm"
              >
                Save Changes
              </button>
            </>
          ) : (
            <button
              onClick={() => setIsEditMode(true)}
              className="bg-blue-600 text-white px-4 py-2 rounded-md text-sm"
            >
              Edit Profile
            </button>
          )}
        </div>
      </div>
      {/* Modal for Profile Photo */}
      {isModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Profile Photo</h2>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  document.getElementById("photoInput").click();
                  setIsModalOpen(false);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Choose Photo
              </button>
              <button
                onClick={() => {
                  handleDelete();
                  setIsModalOpen(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Remove Photo
              </button>
              <button
                onClick={() => {
                  setIsModalOpen(false);
                  setIsEditMode(false);
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Modal for Cover Photo */}
      {isCoverModalOpen && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white p-5 rounded-lg shadow-xl">
            <h2 className="text-xl font-bold mb-4">Edit Cover Photo</h2>
            <div className="flex flex-col space-y-4">
              <button
                onClick={() => {
                  document.getElementById("coverInput").click();
                  setIsCoverModalOpen(false);
                }}
                className="bg-blue-500 text-white px-4 py-2 rounded-md"
              >
                Choose Photo
              </button>
              <button
                onClick={() => {
                  handleCoverDelete();
                  setIsCoverModalOpen(false);
                }}
                className="bg-red-500 text-white px-4 py-2 rounded-md"
              >
                Remove Photo
              </button>
              <button
                onClick={() => {
                  setIsCoverModalOpen(false);
                  setIsEditMode(false);
                }}
                className="bg-gray-300 text-gray-800 px-4 py-2 rounded-md"
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Hidden file inputs */}
      <input
        type="file"
        id="photoInput"
        name="profilePhoto"
        accept="image/*"
        onChange={(e) => {
          setUserdata({
            ...userdata,
            profilePhoto: e.target.files[0],
            profilePhotopreview: URL.createObjectURL(e.target.files[0]),
          });
        }}
        className="hidden"
      />
      <input
        type="file"
        id="coverInput"
        name="coverphoto"
        accept="image/*"
        onChange={(e) => {
          setUserdata({
            ...userdata,
            coverphoto: e.target.files[0],
            coverphotopreview: URL.createObjectURL(e.target.files[0]),
          });
        }}
        className="hidden"
      />
      {/* <Profile/> */}
    </div>
  );
};

export default ProfilePage;
