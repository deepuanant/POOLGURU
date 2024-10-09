import React, { useState, useRef } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-hot-toast";
import { Link, useNavigate } from "react-router-dom";
import { updateuser, removeProfilePhoto } from "../../api/userapi";
import { setProfile, updateProfileField } from "../../Redux/profileSlice";
import { addUser } from "../../Redux/userslice";
import LoadingSpinner from "../../components/Home/Loadingspinner";
import LocationSelector from "./LocationSelector"; // Import the LocationSelector component

const SettingsPage = () => {
  const defaultProfileImage = "https://via.placeholder.com/150";
  const dispatch = useDispatch();
  const navigate = useNavigate();
  let profile = useSelector((state) => state.profile);
  // console.log("dude nice ", profile);

  if (profile.email === "NA") {
    profile = useSelector((state) => state.profile);
  }

  // Parse location field to extract city, state, and country
  const [city, state, country] = profile.location
    ? profile.location.split(",").map((part) => part.trim())
    : ["NA", "NA", "NA"]; // Default to "NA" if undefined

  const [userdata, setUserdata] = useState({
    firstname: profile.firstname ?? "NA", // Default to "NA" if undefined
    lastname: profile.lastname ?? "NA",
    email: profile.email ?? "NA",
    about: profile.about ?? "NA",
    mobileno: profile.mobileno ?? "NA",
    designation: profile.designation ?? "NA",
    location: profile.location ?? "NA",
    companyname: profile.companyname ?? "NA",
    profilePhoto: profile.profilephoto || defaultProfileImage,
    profilePhotopreview: profile.profilephoto || defaultProfileImage,
  });

  const [loading, setLoading] = useState(false);
  const [isProfileModalOpen, setIsProfileModalOpen] = useState(false);
  const profilePhotoInputRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setUserdata((prevuserdata) => ({
      ...prevuserdata,
      [name]: value || "NA", // Set value to "NA" if empty
    }));
    dispatch(updateProfileField({ field: name, value: value || "NA" }));
  };

  const updatestate = async (user) => {
    try {
      localStorage.setItem("user", JSON.stringify(user));
      dispatch(addUser(user));
    } catch (error) {
      console.log(error);
    }
  };
  const handleUpdate = async () => {
    setLoading(true);
    try {
      const formData = new FormData();
      Object.keys(userdata).forEach((key) => {
        if (userdata[key] instanceof File) {
          formData.append(key, userdata[key]);
        } else {
          formData.append(key, userdata[key]);
        }
      });

      const response = await updateuser(formData);
      if (response.status === 200) {
        toast.success(response.data.message);
        dispatch(setProfile(response.data.user)); // Dispatch Redux action to update state
        updatestate(response.data.user);
        navigate("/profile");
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

  const handleProfilePhotoChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setUserdata((prev) => ({
        ...prev,
        profilePhoto: file,
        profilePhotopreview: URL.createObjectURL(file),
      }));
      dispatch(updateProfileField({ field: "profilephoto", value: file }));
      setIsProfileModalOpen(false); // Close modal after selection
      toast.success("Profile photo uploaded successfully!");
    }
  };

  const handleDeleteProfilePhoto = async () => {
    setLoading(true);
    try {
      const response = await removeProfilePhoto();
      if (response.status === 200) {
        toast.success(response.data.message);
        setUserdata((prev) => ({
          ...prev,
          profilePhoto: defaultProfileImage,
          profilePhotopreview: defaultProfileImage,
        }));
        dispatch(
          updateProfileField({
            field: "profilephoto",
            value: defaultProfileImage,
          })
        );
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      }
    }
    setLoading(false);
    setIsProfileModalOpen(false);
  };

  return (
    <div className="bg-gradient-to-r from-orange-100 to-gray-100 dark:from-gray-900 dark:to-gray-700 min-h-screen py-10 px-4">
      <h2 className="text-3xl font-bold text-center mb-8 text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500">
        Edit Profile
      </h2>
      {loading && <LoadingSpinner />}

      {/* Main container with Profile card on the left and form on the right */}
      <div className="flex  flex-col lg:flex-row gap-8 justify-center items-center">
        {/* Profile card */}
        <div className="lg:self-start ">
          <div className="max-w-lg bg-white border rounded-lg shadow-lg p-2 flex flex-col items-center relative">
            <div className="w-96 aspect-[1/1]">
              <img
                className="w-full h-full rounded object-fill"
                src={userdata.profilePhotopreview}
                alt="Profile"
              />
            </div>
            <button
              className="absolute bottom-3 right-3 bg-white p-2 rounded-full shadow-md text-gray-600 hover:text-gray-800"
              onClick={() => setIsProfileModalOpen(true)}
            >
              {/* Edit Profile Photo Icon */}
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
        {/* Form on the right side */}
        <div className="w-full max-w-3xl bg-white p-6 shadow-lg rounded-lg">
          <div className="grid md:grid-cols-2 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700">
                First Name
              </label>
              <input
                type="text"
                name="firstname"
                value={userdata.firstname === "NA" ? "" : userdata.firstname}
                onChange={handleChange}
                placeholder={userdata.firstname === "NA" ? "NA" : ""}
                className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Last Name
              </label>
              <input
                type="text"
                name="lastname"
                value={userdata.lastname === "NA" ? "" : userdata.lastname}
                onChange={handleChange}
                placeholder={userdata.lastname === "NA" ? "NA" : ""}
                className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Email
              </label>
              <input
                type="email"
                name="email"
                value={userdata.email === "NA" ? "" : userdata.email}
                onChange={handleChange}
                placeholder={userdata.email === "NA" ? "NA" : ""}
                className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500 "
                disabled
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Mobile No
              </label>
              <input
                type="text"
                name="mobileno"
                value={userdata.mobileno === "NA" ? "" : userdata.mobileno}
                onChange={handleChange}
                placeholder={userdata.mobileno === "NA" ? "NA" : ""}
                className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700">
                Designation
              </label>
              <input
                type="text"
                name="designation"
                value={
                  userdata.designation === "NA" ? "" : userdata.designation
                }
                onChange={handleChange}
                placeholder={userdata.designation === "NA" ? "NA" : ""}
                className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Location
              </label>
              <LocationSelector
                initialCountry={country}
                initialState={state}
                initialCity={city}
                onLocationChange={(location) => {
                  setUserdata((prev) => ({ ...prev, location }));
                  dispatch(
                    updateProfileField({ field: "location", value: location })
                  );
                }}
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                Company Name
              </label>
              <input
                type="text"
                name="companyname"
                value={
                  userdata.companyname === "NA" ? "" : userdata.companyname
                }
                onChange={handleChange}
                placeholder={userdata.companyname === "NA" ? "NA" : ""}
                className="mt-1 block w-full p-2 border-gray-300 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
            <div className="col-span-2">
              <label className="block text-sm font-medium text-gray-700">
                About
              </label>
              <textarea
                name="about"
                value={userdata.about === "NA" ? "" : userdata.about}
                onChange={handleChange}
                placeholder={userdata.about === "NA" ? "NA" : ""}
                className="mt-1 block w-full border-gray-300  p-2 rounded-md shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
            </div>
          </div>
          <div className="mt-4 flex justify-end space-x-4">
            <button
              onClick={handleUpdate}
              className="text-white bg-gradient-to-r from-orange-500 to-yellow-500 border-2 p-2 rounded-lg px-4 font-medium text-sm transition duration-300 transform hover:scale-105 shadow-md"
            >
              Save
            </button>
            <Link to="/profile">
              <button className="text-orange-400 bg-white hover:text-white hover:bg-gradient-to-r from-orange-500 to-yellow-500 border-2 p-2 rounded-lg px-4 font-medium text-sm transition duration-300 transform hover:scale-105 shadow-md">
                Back
              </button>
            </Link>
          </div>
        </div>
      </div>

      {/* Profile Photo Modal */}
      {isProfileModalOpen && (
        <div className="fixed inset-0  bg-opacity-55 overflow-y-auto h-full w-full flex items-center justify-center">
          <div className="bg-white dark:bg-gray-800 p-6 rounded-lg shadow-2xl">
            <h2 className="text-2xl font-bold text-transparent bg-clip-text bg-gradient-to-r from-orange-500 to-yellow-500 mb-4">
              Edit Profile Photo
            </h2>
            <div className="flex flex-col space-y-4">
              <input
                type="file"
                accept="image/*"
                ref={profilePhotoInputRef}
                onChange={handleProfilePhotoChange}
                className="hidden"
              />
              <button
                onClick={() => profilePhotoInputRef.current.click()}
                className="bg-gradient-to-r from-orange-500 to-yellow-500 text-white px-4 py-2 rounded-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-orange-400"
              >
                Choose Photo
              </button>
              <button
                onClick={handleDeleteProfilePhoto}
                className="bg-gradient-to-r from-red-600 to-red-500 text-white px-4 py-2 rounded-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-red-400"
              >
                Remove Photo
              </button>
              <button
                onClick={() => setIsProfileModalOpen(false)}
                className="bg-gradient-to-r from-gray-600 to-gray-500 text-white px-4 py-2 rounded-md transition transform hover:scale-105 focus:outline-none focus:ring-2 focus:ring-gray-400"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default SettingsPage;
