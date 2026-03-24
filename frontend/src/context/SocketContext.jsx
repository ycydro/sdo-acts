import React, { createContext, useContext, useEffect, useState } from "react";
import { io } from "socket.io-client";

const SocketContext = createContext();

// const getBaseURL = () => {
//   if (typeof window !== "undefined") {
//     const hostname = window.location.hostname;

//     if (hostname !== "localhost" && hostname !== "127.0.0.1") {
//       return `http://${hostname}:8080`;
//     }
//   }
//   return "http://localhost:8080";
// };

const getBaseURL = () => {
  if (import.meta.env.VITE_SOCKET_URL) {
    return import.meta.env.VITE_SOCKET_URL;
  }

  if (import.meta.env.PROD) {
    return undefined; // socket.io will automatically use the same origin
  }

  const hostname = window.location.hostname;
  return `http://${hostname}:8080`;
};

export const SocketProvider = ({ children }) => {
  const [socket, setSocket] = useState(null);
  const [isConnected, setIsConnected] = useState(false);

  useEffect(() => {
    const newSocket = io(getBaseURL(), {
      autoConnect: true,
      reconnection: true,
      reconnectionDelay: 1000,
      reconnectionAttempts: 5,
    });

    newSocket.on("connect", () => {
      console.log("✅ Socket connected:", newSocket.id);
      setIsConnected(true);
    });

    newSocket.on("disconnect", () => {
      console.log("❌ Socket disconnected");
      setIsConnected(false);
    });

    newSocket.on("connect_error", (error) => {
      console.error("Socket connection error:", error);
      setIsConnected(false);
    });

    setSocket(newSocket);

    return () => {
      newSocket.close();
    };
  }, []);

  const joinDepartment = (departmentId) => {
    if (socket && departmentId) {
      socket.emit("join-department", departmentId);
      console.log(`Joined department room: ${departmentId}`);
    }
  };

  const leaveDepartment = (departmentId) => {
    if (socket && departmentId) {
      socket.emit("leave-department", departmentId);
      console.log(`Left department room: ${departmentId}`);
    }
  };

  const joinAllDepartments = () => {
    if (socket) {
      socket.emit("join-all-departments");
      console.log("Joined all departments room");
    }
  };

  return (
    <SocketContext.Provider
      value={{
        socket,
        isConnected,
        joinDepartment,
        leaveDepartment,
        joinAllDepartments,
      }}
    >
      {children}
    </SocketContext.Provider>
  );
};

export const useSocket = () => {
  const context = useContext(SocketContext);
  if (!context) {
    throw new Error("useSocket must be used within a SocketProvider");
  }
  return context;
};
