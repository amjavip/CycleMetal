import axios from "axios";
import { useAuth } from "../context/AuthContext";
export const refreshAccessToken = async () => {
  try {
    const refresh = localStorage.getItem("refresh");
    console.log("gg");
    if (!refresh) return null;

    const res = await axios.post("http://127.0.0.1:8000/users/api/token/refresh/", {
      refresh: refresh,
    });

    const newAccessToken = res.data.access;
    localStorage.setItem("access", newAccessToken);

    return newAccessToken;
  } catch (err) {
    // Aquí podrías limpiar localStorage o avisar que el token expir
      const { logout } = useAuth();
      logout();
      console.log("gg");
    return null;
  }
};
