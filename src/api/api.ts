import axios from "axios";
import { getUserToken } from "helpers/global";

const api = axios.create({
  baseURL: process.env.REACT_APP_REST_API_URL,
  headers: {
    Pragma: "no-cache",
    "Cache-Control": "no-cache",
  },
  timeout: 5000,
});

api.interceptors.request.use((config) => {
  const token = getUserToken();

  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }

  return config;
});

export default api;
