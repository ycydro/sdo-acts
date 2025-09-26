import { Routes, Route } from "react-router-dom";
import Test from "../pages/Test";

import MainLayout from "../layouts/MainLayout";
import LoginPage from "../pages/auth/LoginPage";
import RegisterPage from "../pages/auth/RegisterPage";
import NotFoundPage from "../pages/NotFoundPage";

const routes = [
  {
    path: "/",
    element: <MainLayout />,
    children: [
      // {
      //   path: "dashboard",
      //   element: <Dashboard />,
      // },
    ],
  },
  {
    path: "*",
    element: <NotFoundPage />,
  },
  {
    path: "/login",
    element: <LoginPage />,
  },
  {
    path: "/register",
    element: <RegisterPage />,
  },
  {
    path: "/test",
    element: <Test />,
  },
];

const renderRoutes = (routes) =>
  routes.map(({ path, element, children }) => (
    <Route key={path} path={path} element={element}>
      {children && renderRoutes(children)}
    </Route>
  ));

const AppRoutes = () => {
  return <Routes>{renderRoutes(routes)}</Routes>;
};

export default AppRoutes;
