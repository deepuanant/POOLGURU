import axios from "axios";

// Determine which host to use based on the .env setting
const useLocal = import.meta.env.VITE_USE_LOCAL === "false";
const host = useLocal
  ? import.meta.env.VITE_LOCAL_URL
  : import.meta.env.VITE_SERVER_URL;

// Admin API

export const updateseenstatus = async (id, seenstatus) => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.put(
      `${host}/api/v1/sendmessage/updateseenstatus/${id}`,
      { seenstatus },
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};
export const updateNotification = async (id, updates) => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.put(
      `${host}/api/v1/notifications/update/${id}`,
      updates,
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const deleteNotification = async (id) => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.delete(
      `${host}/api/v1/notifications/delete/${id}`,
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const sendCircular = async (circulardata) => {
  try {
    const headers = {
      "Content-Type": "multipart/form-data",
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.post(
      `${host}/api/v1/circulars/create`,
      circulardata,
      {
        headers,
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

export const getCircular = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.get(`${host}/api/v1/circulars/get`, {
      headers,
    });
    return response;
  } catch (error) {
    return error;
  }
};
export const sendNotification = async (title, message) => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.post(
      `${host}/api/v1/notifications/add`,
      { title, message },
      {
        headers,
      }
    );

    return response;
  } catch (error) {
    return error;
  }
};

export const getallNotifications = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.get(`${host}/api/v1/notifications/getall`, {
      headers,
    });
    return response;
  } catch (error) {
    return error;
  }
};

// Admin Circular API

export const updateCircular = async (id, updates) => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.put(
      `${host}/api/v1/circulars/update/${id}`,
      updates,
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const deleteCircular = async (id) => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.delete(
      `${host}/api/v1/circulars/delete/${id}`,
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

// Admin contact me API

export const deletecontact = async (id) => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.delete(
      `${host}/api/v1/sendmessage/deletecontact/${id}`,
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const fetchMessages = async (page = 1, pageSize = 5) => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.get(`${host}/api/v1/sendmessage/getcontact`, {
      headers,
      params: {
        page,
        pageSize,
      },
    });
    return response.data; // Ensure that the API returns { data: { messages: [], totalPages: number } }
  } catch (error) {
    console.error("Error fetching messages:", error);
    throw error; // Rethrow the error so it can be handled in the component
  }
};

// Admin User API

export const getallusers = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.get(`${host}/api/v1/auth/getAllusers`, {
      headers,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const deleteuser = async (id) => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.delete(`${host}/api/v1/auth/users/${id}`, {
      headers,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const changerole = async (id, role) => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.put(
      `${host}/api/v1/auth/users/change-role/${id}`,
      { role },
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const assignpage = async (id, services) => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.post(
      `${host}/api/v1/auth/assignpages/${id}`,
      { services },
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const unassignpage = async (id, services) => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.post(
      `${host}/api/v1/auth/removepages/${id}`,
      { services },
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};
