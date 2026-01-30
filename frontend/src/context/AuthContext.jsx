import React, { createContext, useContext, useState, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
  const [isLoggingOut, setIsLoggingOut] = useState(false);

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

        // handle redirect for "remember me" users when landing on login page
        const currentPath = window.location.pathname;
        if (currentPath === "/login") {
          const storedRedirect = sessionStorage.getItem("redirectPath");

          if (storedRedirect && storedRedirect !== "/login") {
            console.log(
              "[AuthContext] Redirecting remembered user to:",
              storedRedirect,
            );
            sessionStorage.removeItem("redirectPath");
            navigate(storedRedirect, { replace: true });
          } else {
            const defaultPath =
              decoded.role.toLowerCase() === "client" ? "/dashboard" : "/main";
            console.log(
              "[AuthContext] Redirecting remembered user to default:",
              defaultPath,
            );
            navigate(defaultPath, { replace: true });
          }
        }
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

      // redirect
      const storedRedirect = sessionStorage.getItem("redirectPath");

      // stored redirect from external link
      if (storedRedirect && storedRedirect !== "/login") {
        console.log("[Login] Redirecting to stored path:", storedRedirect);
        sessionStorage.removeItem("redirectPath");
        navigate(storedRedirect, { replace: true });
        return decoded;
      }

      // default redirect based on role
      const defaultPath =
        decoded.role.toLowerCase() === "client" ? "/dashboard" : "/main";
      console.log("[Login] No redirect found, going to default:", defaultPath);
      navigate(defaultPath, { replace: true });

      return decoded;
    } catch (error) {
      const message =
        error.response?.data?.message ||
        "Something went wrong. Please try again.";
      throw new Error(message);
    }
  };

  const handleLogout = () => {
    setIsLoggingOut(true);
    setUser(null);
    setToken(null);
    localStorage.removeItem("token");
    sessionStorage.removeItem("token");
    sessionStorage.removeItem("redirectPath");

    queryClient.clear();

    // Clear the flag after navigation
    setTimeout(() => setIsLoggingOut(false), 500);
    navigate("/login");
  };

  return (
    <AuthContext.Provider
      value={{
        user, // decoded JWT
        token, // actual JWT
        loading,
        isLoggingOut,
        login,
        logout: handleLogout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
