import { Routes, Route, Navigate } from "react-router-dom";
import Test from "../pages/Test";

const routes = [
  {
    path: "/",
    element: <Navigate to="/test" />,
  },
  {
    path: "/test",
    element: <Test />,
  },
];

const AppRoutes = () => {
  return (
    <Routes>
      {routes.map((route) => (
        <Route key={route.path} path={route.path} element={route.element} />
      ))}
    </Routes>
  );
};

export default AppRoutes;
