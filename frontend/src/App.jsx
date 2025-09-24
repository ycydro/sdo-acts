import { Button } from "@/components/ui/button";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Test from "./pages/Test";

const App = () => {
  return (
    <Router>
      <Routes>
        <Route path="/test" element={<Test />} />
      </Routes>
    </Router>
  );
};

export default App;
