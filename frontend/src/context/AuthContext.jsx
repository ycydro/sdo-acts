import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { authService } from "../api/services/authService";
import { useQueryClient } from "@tanstack/react-query";
import { jwtDecode } from "jwt-decode";

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const navigate = useNavigate();
  const queryClient = useQueryClient();

  const [user, setUser] = useState(null);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const savedToken =
      localStorage.getItem("token") || sessionStorage.getItem("token");

    if (savedToken) {
      try {
        const decoded = jwtDecode(savedToken);

        if (decoded.exp && decoded.exp * 1000 < Date.now()) {
          handleLogout();
          return;
        }

        setToken(savedToken);
        setUser(decoded);
      } catch (err) {
        console.error("Invalid token:", err);
        handleLogout();
      }
    }

    setLoading(false);
  }, []);

  const login = async (credentials, rememberMe) => {
    try {
      const { token: jwtToken } = await authService.login(credentials);

      // decode token
      const decoded = jwtDecode(jwtToken);
      console.log("Decoded", decoded);
      setUser(decoded);
      setToken(jwtToken);

      // save token
      if (rememberMe) {
        localStorage.setItem("token", jwtToken);
      } else {
        sessionStorage.setItem("token", jwtToken);
      }

      // clear old cache
      queryClient.clear();

      // redirect based on role
      const redirectPath =
        decoded.role === "client" ? "/dashboard" : "/main/dashboard";
      navigate(redirectPath);
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      throw new Error(message);
    }
  };

  const handleLogout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");

    // clear all user's cache when logging out
    queryClient.clear();
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user, // decoded JWT
        token, // actual JWT
        loading,
        login,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
