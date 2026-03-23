import axios from "axios";

const request = axios.create({
  baseURL: import.meta.env.VITE_API_BASE_URL || "http://127.0.0.1:17890",
  timeout: 15_000,
});

request.interceptors.response.use(
  (res) => res.data,
  (err) => {
    console.error("[request]", err);
    return Promise.reject(err);
  },
);

export default request;
