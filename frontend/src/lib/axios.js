import axios from "axios";

export const axiosInstance = axios.create({
  baseURL:
    import.meta.env.MODE === "development"
      ? "http://localhost:5001/api"
      : "https://chatapp-f19u.onrender.com/api", // Render backend URL
  withCredentials: true,
});
