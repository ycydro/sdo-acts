import { Button } from "@/components/ui/button";
import { Toaster } from "@/components/ui/sonner";

import { BrowserRouter as Router } from "react-router-dom";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import AppRoutes from "./routes/AppRoutes";
import { AuthProvider } from "./context/AuthContext";
import { SocketProvider } from "./context/SocketContext";

const queryClient = new QueryClient();

const App = () => {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <AuthProvider>
          <SocketProvider>
            <AppRoutes />
          </SocketProvider>
        </AuthProvider>
        <Toaster duration={3000} richColors />
      </Router>
    </QueryClientProvider>
  );
};

export default App;
