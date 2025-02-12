import { createContext, useContext, useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const navigate = useNavigate();

  // Safely initialize user from localStorage:
  const getInitialUser = () => {
    const storedUser = localStorage.getItem("user");
    console.log("Stored user from localStorage:", storedUser);
    if (storedUser && storedUser !== "undefined") {
      try {
        return JSON.parse(storedUser);
      } catch (error) {
        console.error("Error parsing stored user:", error);
        return null;
      }
    }
    return null;
  };

  const [user, setUser] = useState(getInitialUser);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      console.log("Attempting to login with:", email);
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/login`,
        { email, password }
      );
      console.log("Login response:", res.data);
      
      const userObj = {
        _id: res.data.userId,
        role: res.data.role,
        email: email, 
      };
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(userObj));
      setUser(userObj);
      navigate("/dashboard");
    } catch (err) {
      console.error("Login failed:", err);
      alert("Login failed");
    }
  };

  const register = async (email, password) => {
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/api/auth/register`,
        { email, password }
      );
      alert("User successfully registered. Now please log in.");
      navigate("/login");
    } catch (err) {
      console.error("Registration failed:", err);
      alert("Registration failed");
    }
  };

  const guestLogin = async () => {
    try {
      const res = await axios.post(
        `${process.env.REACT_APP_API_URL}/api/guest`,
        {},
        { headers: { "Content-Type": "application/json" } }
      );
      console.log("Guest login response:", res.data);
      // Construct guest user object from response:
      const guestUser = {
        _id: res.data.userId || res.data.email, 
        role: res.data.role || "guest",
        email: res.data.email || "",
      };
      localStorage.setItem("token", res.data.token);
      localStorage.setItem("user", JSON.stringify(guestUser));
      setUser(guestUser);
      alert("You are logged in successfully as a guest");
      navigate("/dashboard");
    } catch (err) {
      console.error("Guest login failed:", err);
      alert("Guest login failed");
    }
  };

  const logout = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    setUser(null);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{ user, login, register, guestLogin, logout, loading }}
    >
      {loading ? <div>Loading...</div> : children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);
