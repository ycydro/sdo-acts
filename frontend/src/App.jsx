import { Button } from "@/components/ui/button";
import { BrowserRouter as Router } from "react-router-dom";
import Test from "./pages/Test";
import AppRoutes from "./routes/AppRoutes";

const App = () => {
  return (
    <Router>
      <AppRoutes />
    </Router>
  );
};

export default App;
