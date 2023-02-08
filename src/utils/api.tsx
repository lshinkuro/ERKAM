import axios from "axios";

export const baseURL = process.env.REACT_APP_API_URL;
console.log({ baseURL });

const axiosInstance = axios.create();
axiosInstance.defaults.baseURL = baseURL;

const save: any = localStorage.getItem("auth");
try {
  const { token } = JSON.parse(save);
  axiosInstance.defaults.headers = {
    authorization:`Bearer ${token}`
  };
} catch (error) {}

export default axiosInstance;
