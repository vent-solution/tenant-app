import axios from "axios";

// create axios instance
const axiosInstance = axios.create({
  baseURL: `${process.env.REACT_APP_API_URL}`,
  timeout: 10000,
});

axiosInstance.interceptors.request.use(
  (config) => {
    return config;
  },

  (error) => {
    return Promise.reject(error);
  }
);

axiosInstance.interceptors.response.use(
  (response) => response,
  (error) => error.response
);

// export const getIp = async () => {
//   try {
//     const response = await axios.get("https://api.ipify.org?format=json");
//     console.log("USER IP", response.data);
//     return response.data; // Return the public IP directly
//   } catch (error) {
//     console.error("Error fetching IP address:", error);
//     return null; // Return null or handle error appropriately
//   }
// };

// Get current user location
export const getUserLocation = async () => {
  try {
    const response = await axios.get("http://ip-api.com/json/");
    sessionStorage.setItem("userLocation", JSON.stringify(response.data));

    return response.data;
  } catch (error) {
    console.log("Error fetching user location: ", error);
  }
};

// Fetch data api request
export const fetchData = async (endpoint: string) => {
  try {
    const response = await axiosInstance.get(endpoint);
    return response;
  } catch (error) {
    throw error;
  }
};

// post data api request
export const postData = async (endpoint: string, data: any) => {
  try {
    const response = await axiosInstance.post(endpoint, data);
    return response;
  } catch (error: any) {
    throw error.message;
  }
};

// update data api request
export const putData = async (endpoint: string, data: any) => {
  try {
    const response = await axiosInstance.put(endpoint, data);
    return response;
  } catch (error) {
    throw error;
  }
};

// delete data api request
export const deleteData = async (endpoint: string) => {
  try {
    const response = await axiosInstance.delete(endpoint);
    return response;
  } catch (error) {
    throw error;
  }
};
