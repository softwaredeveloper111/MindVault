import axios from "../../../Axios";

export const registerAPI = async (userData) => {
  try {
    const response = await axios.post("/api/auth/register", userData);
    console.log(response)
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};




export const loginAPI = async (userData) => {
  try {
    const response = await axios.post("/api/auth/login", userData);
    console.log(response)
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};




export const getMeAPI = async () => {
  try {
    const response = await axios.get("/api/auth/me");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};






export const logoutAPI = async () => {
  try {
    const response = await axios.post("/api/auth/logout");
    return response.data;
  } catch (error) {
    console.log(error);
    throw error;
  }
};
