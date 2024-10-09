import React, { useState, useEffect, useRef } from "react";
import { Link } from "react-router-dom";
import { getallusers, deleteuser, changerole } from "./../../../api/adminapi";
import { FaTrash, FaEdit } from "react-icons/fa";
import { toast } from "react-hot-toast";
import { usePopper } from "react-popper";
import AssignpagesModal from "./AssignModal";
import { assignpage } from "./../../../api/adminapi";

const UserTable = () => {
  const [actionDropdownOpen, setActionDropdownOpen] = useState(false);
  const [roleDropdownOpen, setRoleDropdownOpen] = useState(null);
  const [users, setUsers] = useState([]);
  const [filteredUsers, setFilteredUsers] = useState([]);
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedRole, setSelectedRole] = useState("All");
  const [selectAll, setSelectAll] = useState(false);
  const [selectedUserIds, setSelectedUserIds] = useState([]);
  const [buttonLabel, setButtonLabel] = useState("All");
  const [editingUserId, setEditingUserId] = useState(null); // State to track the user being edited
  const [editingRole, setEditingRole] = useState(""); // State to track the new role being edited
  const [isModalOpen, setIsModalOpen] = useState(false);
  const [selectedServices, setSelectedServices] = useState([]);
  const [selecteduser, setSelectedUser] = useState([]);
  const [defaultservice, setDefaultService] = useState([]);
  const [update, setUpdate] = useState(false);

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const response = await getallusers();
        setUsers(response.data); // Access the 'data' field from the response
        setFilteredUsers(response.data); // Initialize filteredUsers
      } catch (error) {
        console.error("Failed to fetch users:", error);
      }
    };

    fetchUsers();
  }, [update]);

  useEffect(() => {
    // Filter users based on the selected role and search term
    let updatedUsers = users;

    if (selectedRole !== "All") {
      updatedUsers = updatedUsers.filter((user) => user.role === selectedRole);
    }

    if (searchTerm) {
      updatedUsers = updatedUsers.filter(
        (user) =>
          user.firstname?.toLowerCase().includes(searchTerm.toLowerCase()) ||
          user.username?.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }

    setFilteredUsers(updatedUsers);
  }, [selectedRole, searchTerm, users]);

  useEffect(() => {
    // Update selectedUserIds based on selectAll state
    if (selectAll) {
      setSelectedUserIds(filteredUsers.map((user) => user._id));
    } else {
      setSelectedUserIds([]);
    }
  }, [selectAll, filteredUsers]);

  const toggleActionDropdown = () => {
    setActionDropdownOpen(!actionDropdownOpen);
  };

  const toggleRoleDropdown = (userId) => {
    setRoleDropdownOpen(roleDropdownOpen === userId ? null : userId);
  };

  const handleRoleChange = (role) => {
    setSelectedRole(role);
    // Set the button label based on the selected role
    setButtonLabel(
      role === "All" ? "All" : role === "Admin" ? "Admin" : "Employee"
    );
    setActionDropdownOpen(false);
  };

  const handleSearchChange = (event) => {
    setSearchTerm(event.target.value);
  };

  const handleSelectAll = (event) => {
    setSelectAll(event.target.checked);
  };

  const handleDelete = async () => {
    try {
      // Send delete request to the backend
      await Promise.all(selectedUserIds.map((id) => deleteuser(id)));

      // Filter out the users to delete
      const updatedUsers = users.filter(
        (user) => !selectedUserIds.includes(user._id)
      );

      // Update both users and filteredUsers states
      setUsers(updatedUsers);
      setFilteredUsers(updatedUsers);

      // Clear selected IDs after deletion
      setSelectedUserIds([]);
      toast.success("User deleted successfully");
    } catch (error) {
      toast.error("Failed to delete users:", error);
    }
  };

  const handleCheckboxChange = (userId) => {
    setSelectedUserIds((prevSelectedIds) => {
      if (prevSelectedIds.includes(userId)) {
        return prevSelectedIds.filter((id) => id !== userId);
      } else {
        return [...prevSelectedIds, userId];
      }
    });
  };

  const handleEditClick = (userId, currentRole) => {
    setEditingUserId(userId);
    setEditingRole(currentRole);
  };

  const handleRoleSelectChange = (role) => {
    setEditingRole(role);
    setRoleDropdownOpen(null); // Close the dropdown after selecting a role
  };

  const handleSaveClick = async (userId) => {
    try {
      // Call the API to change the role
      const response = await changerole(userId, editingRole);
      if (response.status === 200) {
        // Update the frontend state
        const updatedUsers = users.map((user) =>
          user._id === userId ? { ...user, role: editingRole } : user
        );
        setUsers(updatedUsers);
        setFilteredUsers(updatedUsers);
        setEditingUserId(null);
        setRoleDropdownOpen(null);
        toast.success(response.data.message);
      } else {
        toast.error("Failed to update user role");
      }
    } catch (error) {
      if (error.response) {
        toast.error(error.response.data.message);
      } else {
        toast.error("Failed to change user role:", error);
      }
    }
  };

  // Close dropdown when clicking outside
  const dropdownRef = useRef(null);
  useEffect(() => {
    const handleClickOutside = (event) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
        setRoleDropdownOpen(null);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // for assigning pages access

  const handleActionClick = (id, service) => {
    setSelectedUser(id);
    setDefaultService(service);
    setSelectedServices(service);
    setIsModalOpen(true);
  };

  const handleServiceChange = (event) => {
    const { value } = event.target;
    if (selectedServices.includes(value)) {
      setSelectedServices(
        selectedServices.filter((service) => service !== value)
      );
    } else {
      setSelectedServices([...selectedServices, value]);
    }
  };

  const handleModalClose = () => {
    setIsModalOpen(false);
    setSelectedUser(null);
    setDefaultService([]);
    setSelectedServices([]);
  };

  const savepagesaccess = async () => {
    try {
      const response = await assignpage(selecteduser, selectedServices);
      if (response.status === 200) {
        toast.success(response.data.message);
        setUpdate(!update);
      } else {
        toast.error("Failed to assign pages access");
      }
      setIsModalOpen(false);
      setSelectedServices([]);
      setSelectedUser(null);
      setDefaultService([]);
    } catch (error) {
      setIsModalOpen(false);
      setSelectedServices([]);
      setSelectedUser(null);
      setDefaultService([]);

      toast.error("Failed to update pages access:", error);
    }
  };

  return (
    <div className="relative overflow-x-auto shadow-xl p-10 sm:rounded-lg max-w-[900px] mx-auto">
      <div className="flex items-center justify-between flex-column flex-wrap md:flex-row space-y-4 md:space-y-0 pb-4 bg-white dark:bg-gray-900">
        <div className="flex items-center space-x-2">
          <button
            onClick={handleDelete}
            className="inline-flex items-center text-red-500 bg-white border border-gray-300 focus:outline-none hover:bg-gray-100 focus:ring-4 focus:ring-gray-100 font-medium rounded-lg text-sm p-2 dark:bg-gray-800 dark:text-red-400 dark:border-gray-600 dark:hover:bg-gray-700 dark:hover:border-gray-600 dark:focus:ring-gray-700"
            type="button"
            disabled={selectedUserIds.length === 0}
          >
            <FaTrash className="w-5 h-5" />
            <span className="sr-only">Delete selected users</span>
          </button>
          <div className="relative">
            <button
              id="dropdownActionButton"
              onClick={toggleActionDropdown}
              className="flex items-center justify-between w-full py-2 px-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-gray-400 dark:hover:text-white dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
              type="button"
            >
              <span className="sr-only">Action button</span>
              {buttonLabel}{" "}
              <svg
                className="w-2.5 h-2.5 ms-3"
                aria-hidden="true"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 10 6"
              >
                <path
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="m1 1 4 4 4-4"
                />
              </svg>
            </button>
            {actionDropdownOpen && (
              <div
                id="dropdownAction"
                className="absolute z-10 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
              >
                <ul
                  className="py-2 text-sm text-gray-700 dark:text-gray-200"
                  aria-labelledby="dropdownActionButton"
                >
                  <li>
                    <Link
                      to="#"
                      onClick={() => handleRoleChange("Admin")}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Admin
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      onClick={() => handleRoleChange("Employee")}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      Employee
                    </Link>
                  </li>
                  <li>
                    <Link
                      to="#"
                      onClick={() => handleRoleChange("All")}
                      className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
                    >
                      All
                    </Link>
                  </li>
                </ul>
              </div>
            )}
          </div>
        </div>
        <label htmlFor="table-search" className="sr-only">
          Search
        </label>
        <div className="relative">
          <div className="absolute inset-y-0 rtl:inset-r-0 start-0 flex items-center ps-3 pointer-events-none">
            <svg
              className="w-4 h-4 text-gray-500 dark:text-gray-400"
              aria-hidden="true"
              xmlns="http://www.w3.org/2000/svg"
              fill="none"
              viewBox="0 0 20 20"
            >
              <path
                stroke="currentColor"
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
              />
            </svg>
          </div>
          <input
            type="text"
            id="table-search-users"
            value={searchTerm}
            onChange={handleSearchChange}
            className="block p-2 ps-10 text-sm text-gray-900 border border-gray-300 rounded-lg w-40 bg-gray-50 focus:ring-blue-500 focus:border-blue-500 dark:bg-gray-700 dark:border-gray-600 dark:placeholder-gray-400 dark:text-white dark:focus:ring-blue-500 dark:focus:border-blue-500"
            placeholder="Search for users"
          />
        </div>
      </div>
      <table className="w-full text-sm text-left rtl:text-right text-gray-500 dark:text-gray-400">
        <thead className="text-xs text-gray-700 uppercase bg-gray-50 dark:bg-gray-700 dark:text-gray-400">
          <tr>
            <th scope="col" className="p-2">
              <div className="flex items-center">
                <input
                  id="checkbox-all-search"
                  type="checkbox"
                  checked={selectAll}
                  onChange={handleSelectAll}
                  className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                />
                <label htmlFor="checkbox-all-search" className="sr-only">
                  Select all
                </label>
              </div>
            </th>
            <th scope="col" className="px-2 py-1">
              Name
            </th>
            <th scope="col" className="px-2 py-1">
              Role
            </th>
            <th scope="col" className="px-2 py-1">
              Verified
            </th>
            <th scope="col" className="px-2 py-1">
              Action
            </th>
            <th scope="col" className="px-2 py-1">
              Page Access
            </th>
          </tr>
        </thead>
        <tbody>
          {filteredUsers.length > 0 ? (
            filteredUsers.map((user) => (
              <tr
                key={user._id}
                className="bg-white border-b dark:bg-gray-800 dark:border-gray-700 hover:bg-gray-50 dark:hover:bg-gray-600"
              >
                <td className="w-4 p-2">
                  <div className="flex items-center">
                    <input
                      id={`checkbox-table-search-${user._id}`}
                      type="checkbox"
                      checked={selectedUserIds.includes(user._id)}
                      onChange={() => handleCheckboxChange(user._id)}
                      className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 dark:focus:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"
                    />
                    <label
                      htmlFor={`checkbox-table-search-${user._id}`}
                      className="sr-only"
                    >
                      Select {user.firstname}
                    </label>
                  </div>
                </td>
                <th
                  scope="row"
                  className="flex items-center px-2 py-1 text-gray-900 dark:text-white whitespace-nowrap"
                >
                  <img
                    className="w-10 h-10 rounded-full"
                    src={user.profilephoto || "/path/to/placeholder-icon.png"}
                    alt={user.firstname}
                  />
                  <div className="ps-3">
                    <div className="text-base font-semibold">
                      {user.firstname}
                    </div>
                    <div className="font-normal text-gray-500">
                      {user.username}
                    </div>
                  </div>
                </th>
                <td className="px-2 py-1">
                  {editingUserId === user._id ? (
                    <div className="relative" ref={dropdownRef}>
                      <button
                        id="dropdownNavbarLink"
                        data-dropdown-toggle="dropdownNavbar"
                        className="flex items-center justify-between w-full py-2 px-3 text-gray-700 rounded hover:bg-gray-100 md:hover:bg-transparent md:border-0 md:hover:text-blue-700 md:p-0 md:w-auto dark:text-gray-400 dark:hover:text-white dark:focus:text-white dark:border-gray-700 dark:hover:bg-gray-700 md:dark:hover:bg-transparent"
                        type="button"
                        onClick={() => toggleRoleDropdown(user._id)}
                      >
                        {editingRole}{" "}
                        <svg
                          className="w-2.5 h-2.5 ms-3"
                          aria-hidden="true"
                          xmlns="http://www.w3.org/2000/svg"
                          fill="none"
                          viewBox="0 0 10 6"
                        >
                          <path
                            stroke="currentColor"
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth="2"
                            d="m1 1 4 4 4-4"
                          />
                        </svg>
                      </button>
                      {roleDropdownOpen === user._id && (
                        <PopperDropdown
                          userId={user._id}
                          setEditingRole={handleRoleSelectChange}
                        />
                      )}
                    </div>
                  ) : (
                    user.role
                  )}
                </td>
                <td className="px-2 py-1">
                  {user.isVerified ? (
                    <span className="text-green-600">Verified</span>
                  ) : (
                    <span className="text-red-600">Not Verified</span>
                  )}
                </td>
                <td className="px-2 py-1">
                  {editingUserId === user._id ? (
                    <button
                      type="button"
                      onClick={() => handleSaveClick(user._id)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Save
                    </button>
                  ) : (
                    <button
                      type="button"
                      onClick={() => handleEditClick(user._id, user.role)}
                      className="font-medium text-blue-600 dark:text-blue-500 hover:underline"
                    >
                      Edit
                    </button>
                  )}
                </td>
                <td className="px-2 py-1">
                  <div className="flex items-center space-x-2">
                    {user.assignpages.length > 0 ? (
                      <div className="flex items-center">
                        <ul className="list-disc ml-4">
                          {user.assignpages.map((page, index) => (
                            <li key={index} className="text-gray-700">
                              {page}
                            </li>
                          ))}
                        </ul>
                      </div>
                    ) : (
                      <span>None</span>
                    )}
                    <button
                      className="text-blue-500 hover:underline ml-2"
                      onClick={() =>
                        handleActionClick(user._id, user.assignpages)
                      }
                    >
                      <FaEdit />
                    </button>
                  </div>
                </td>
              </tr>
            ))
          ) : (
            <tr>
              <td colSpan="5" className="text-center py-4">
                No users found.
              </td>
            </tr>
          )}
        </tbody>
      </table>
      {isModalOpen && (
        <AssignpagesModal
          defaultServices={defaultservice}
          selectedServices={selectedServices}
          onServiceChange={handleServiceChange}
          onClose={handleModalClose}
          onSave={savepagesaccess}
        />
      )}
    </div>
  );
};

const PopperDropdown = ({ userId, setEditingRole }) => {
  const [referenceElement, setReferenceElement] = useState(null);
  const [popperElement, setPopperElement] = useState(null);
  const { styles, attributes } = usePopper(referenceElement, popperElement, {
    placement: "bottom-start",
  });

  return (
    <div ref={setReferenceElement}>
      <div
        ref={setPopperElement}
        style={styles.popper}
        {...attributes.popper}
        className="absolute z-50 font-normal bg-white divide-y divide-gray-100 rounded-lg shadow w-44 dark:bg-gray-700 dark:divide-gray-600"
      >
        <ul
          className="py-2 text-sm text-gray-700 dark:text-gray-200"
          aria-labelledby="dropdownNavbarLink"
        >
          <li>
            <Link
              to="#"
              onClick={() => setEditingRole("Admin")}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Admin
            </Link>
          </li>
          <li>
            <Link
              to="#"
              onClick={() => setEditingRole("Employee")}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              Employee
            </Link>
          </li>
          <li>
            <Link
              to="#"
              onClick={() => setEditingRole("User")}
              className="block px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-600 dark:hover:text-white"
            >
              User
            </Link>
          </li>
        </ul>
      </div>
    </div>
  );
};

export default UserTable;
