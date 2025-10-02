// src/context/AuthContext.jsx
import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { loginService } from "../services/authService";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);

  useEffect(() => {
    const savedToken = localStorage.getItem("token");
    const savedUser = localStorage.getItem("user");
    if (savedToken && savedUser) {
      setToken(savedToken);
      setUser(JSON.parse(savedUser));
    }
  }, []);

  const login = async (credentials, rememberMe) => {
    try {
      const { user: userData, token: jwtToken } = await loginService(
        credentials
      );

      setUser(userData);
      setToken(jwtToken);

      if (rememberMe) {
        localStorage.setItem("token", jwtToken);
        localStorage.setItem("user", JSON.stringify(userData));
      } else {
        sessionStorage.setItem("token", jwtToken);
        sessionStorage.setItem("user", JSON.stringify(userData));
      }

      navigate("/");
    } catch (error) {
      if (error.response?.data?.message) {
        throw new Error(error.response.data.message);
      }
      throw new Error("Something went wrong. Please try again.");
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    localStorage.removeItem("user");
    navigate("/login");
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
