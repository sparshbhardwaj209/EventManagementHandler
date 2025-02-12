// src/context/authContext.js
import { createContext, useContext, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;
  console.log("Backend API URL:", API_URL);

  const login = async (email, password) => {
    try {
      const res = await axios.post(
        `${API_URL}/api/auth/login`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      const loggedInUser = res.data.user || { email };
      localStorage.setItem("token", res.data.token);
      setUser(loggedInUser);
      alert("You are logged in successfully");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(
        "Login error:",
        err.response ? err.response.data : err.message
      );
      alert("Login failed");
    }
  };

  const register = async (email, password) => {
    try {
      await axios.post(
        `${API_URL}/api/auth/register`,
        { email, password },
        { headers: { "Content-Type": "application/json" } }
      );
      // localStorage.setItem('token', res.data.token);
      // setUser(res.data.user);
      alert("User successfully registered. Now please log in.");
      navigate("/login", { replace: true });
    } catch (err) {
      console.error(
        "Register error:",
        err.response ? err.response.data : err.message
      );
      alert("Registration failed");
    }
  };

  const guestLogin = async () => {
    try {
      const res = await axios.post(
        `${API_URL}/api/guest`,
        {},
        { headers: { "Content-Type": "application/json" } }
      );
      const guestUser = res.data.user || { role: "guest" };
      localStorage.setItem("token", res.data.token);
      // setUser(res.data.user);
      setUser(guestUser);
      alert("You are logged in successfully as a guest");
      navigate("/dashboard", { replace: true });
    } catch (err) {
      console.error(
        "Guest login error:",
        err.response ? err.response.data : err.message
      );
      alert("Guest login failed");
    }
  };

  // Logout function: remove token, reset user, and navigate to login.
  const logout = () => {
    localStorage.removeItem("token");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, login, register, guestLogin, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
