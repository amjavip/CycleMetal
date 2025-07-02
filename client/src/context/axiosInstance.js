import axios from "axios";
import { notifyTokenUpdate } from "./tokenService";

const refreshAccessToken = async () => {
  try {
    const res = await axios.post("http://127.0.0.1:8000/users/api/token/refresh/", {
      refresh: localStorage.getItem("refresh"),
    });
    return res.data.access;
  } catch (error) {
    //Todo falata conectar el metodo logout para este caso
    return null;
  }
};

axios.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      const newAccessToken = await refreshAccessToken();

      if (newAccessToken) {
        localStorage.setItem("access", newAccessToken);
        notifyTokenUpdate(newAccessToken);

        axios.defaults.headers.common["Authorization"] = `Bearer ${newAccessToken}`;
        originalRequest.headers["Authorization"] = `Bearer ${newAccessToken}`;

        return axios(originalRequest);
      }
    }
    return Promise.reject(error);
  }
);

export default axios;
