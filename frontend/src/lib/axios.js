import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "https://soder-9mhj.onrender.com/api", // Render backend URL
  withCredentials: true,
});
