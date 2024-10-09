import axios from "axios";

// Determine which host to use based on the .env setting
const useLocal = import.meta.env.VITE_USE_LOCAL === "false";
const host = useLocal ? import.meta.env.VITE_LOCAL_URL : import.meta.env.VITE_SERVER_URL;

// Authentication API
export const login = async (email, password) => {
  try {
    const response = await axios.post(`${host}/api/v1/auth/login`, {
      email,
      password,
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const register = async (username, email, password) => {
  try {
    const response = await axios.post(`${host}/api/v1/auth/register`, {
      username,
      email,
      password,
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

export const loginverify = async (token, otp) => {
  try {
    const data = await axios.post(`${host}/api/v1/auth/loginverify`, {
      token,
      otp,
    });
    return data;
  } catch (error) {
    return error.response;
  }
};

export const loginverify2fa = async (token, otp) => {
  try {
    const data = await axios.post(`${host}/api/v1/auth/loginverify2fa`, {
      token,
      otp,
    });
    return data;
  } catch (error) {
    return error.response;
  }
};

export const sendgmailotp = async (token) => {
  try {
    const response = await axios.post(`${host}/api/v1/auth/sendgmailotp`, {
      token,
    });
    return response;
  } catch (error) {
    return error.response;
  }
};

// export const verifyOTP = async (email, password, token) => {
//   try {
//     const data = await axios.post(`${host}/api/v1/auth/login`, {
//       email,
//       password,
//       token,
//     });
//     return data;
//   } catch (error) {
//     return error.response;
//   }
// };

export const sendresentlink = async (email) => {
  try {
    const data = await axios.post(
      `${host}/api/v1/auth/request-password-reset`,
      { email }
    );
    return data;
  } catch (error) {
    return error.response;
  }
};

export const changepassword = async (password, token) => {
  try {
    const data = await axios.post(`${host}/api/v1/auth/reset-password`, {
      password,
      token,
    });
    return data;
  } catch (error) {
    return error.response;
  }
};

export const lockcheck = async (password) => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.post(
      `${host}/api/v1/auth/lockscreencheck`,
      { password },
      { headers }
    );
    return response;
  } catch (error) {
    return error.response;
  }
};

// Contact me API

export const sendmessage = async (form) => {
  try {
    const data = await axios.post(`${host}/api/v1/sendmessage/contact`, {
      form,
    });
    return data;
  } catch (error) {
    return error.response;
  }
};

// Profile API

export const loginotpstate = async (otpVerify) => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.put(
      `${host}/api/v1/auth/loginoptstatus`,
      { otpVerify },
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const updateuser = async (formdata) => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.post(
      `${host}/api/v1/auth/users/update`,
      formdata,
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const enable2fa = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.post(
      `${host}/api/v1/auth/enable-2fa`,
      {},
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const disable2fa = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.post(
      `${host}/api/v1/auth/disable-2fa`,
      {},
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const verify2faOtp = async (token) => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.post(
      `${host}/api/v1/auth/verify-2fa`,
      { token },
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const removeProfilePhoto = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.delete(
      `${host}/api/v1/auth/removeProfilePhoto`,
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const removeCoverPhoto = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.delete(
      `${host}/api/v1/auth/removeCoverPhoto`,
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

// Notification API

export const getNotifications = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.get(`${host}/api/v1/notifications/get`, {
      headers,
    });
    return response;
  } catch (error) {
    return error;
  }
};

export const markread = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.put(
      `${host}/api/v1/notifications/markread`,
      {},
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

// Circular API

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

export const getcircularofuser = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.get(
      `${host}/api/v1/circulars/getusercircular`,
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

export const markcircularread = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.put(
      `${host}/api/v1/circulars/markread`,
      {},
      {
        headers,
      }
    );
    return response;
  } catch (error) {
    return error;
  }
};

// News API

export const Getnews = async () => {
  try {
    const response = await axios({
      method: "GET",
      url: "https://google-news13.p.rapidapi.com/business?lr=en-US",
      headers: {
        "x-rapidapi-key": "e1e2280492mshfada55f13e8c7f5p1d6a5ejsn908180a1afe4",
        "x-rapidapi-host": "google-news13.p.rapidapi.com",
      },
    });

    if (response.status === 200) {
      // Process the response data
      const { items } = response.data;
      return items; // Return items to be used in the component
    } else {
      console.error("Failed to fetch news");
      return [];
    }
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

export const getnewsfromapi = async () => {
  try {
    const response = await axios.get("https://newsapi.org/v2/top-headlines", {
      params: {
        category: "business",
        country: "in",
        apiKey: "54479867ec884a3fb1a193cc1b2221aa",
      },
    });
    // console.log(response);
    return response;
  } catch (error) {
    console.error("Error fetching news:", error);
    return [];
  }
};

export const getnewsfrombing = async () => {
  const options = {
    method: "GET",
    url: "https://bing-news-search1.p.rapidapi.com/news/search",
    params: {
      freshness: "Day",
      textFormat: "Raw",
      safeSearch: "Off",
    },
    headers: {
      "x-rapidapi-key": "e1e2280492mshfada55f13e8c7f5p1d6a5ejsn908180a1afe4",
      "x-rapidapi-host": "bing-news-search1.p.rapidapi.com",
      "X-BingApis-SDK": "true",
    },
  };

  try {
    const response = await axios.request(options);
    // console.log(response.data);
    return response;
  } catch (error) {
    console.error(error);
    return [];
  }
};

export const getnewsfromyahoo = async () => {
  try {
    const headers = {
      Authorization: `Bearer ${localStorage.getItem("token")}`,
    };
    const response = await axios.get(`${host}/api/news`, {
      headers,
    });
    return response;
  } catch (error) {
    return error;
  }
};
