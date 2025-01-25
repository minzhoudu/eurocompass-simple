import axios from "axios";

const baseURL = import.meta.env.VITE_API_BASE_URL;

export default axios.create({
  baseURL,
  timeout: 10000,
  headers: {
    "Content-Type": "application/json",
  },
  withCredentials: true,
});
