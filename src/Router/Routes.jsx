import { createBrowserRouter } from "react-router-dom";
import Home from "../Pages/Home/Home";
import Login from "../Components/Login";
import Signup from "../Components/SignUp";
import ResetPassword from "../Firebase/ResetPassword";
import PrivateRoute from "./PrivateRoute";
import DashboardLayout from "../Dashboard/DashboardLayout";
import ErrorPage from "../Components/ErrorPage";
import DashboardRedirector from "../DashboardRedirector";
import MainLayout from "../Layouts/MainLayout";
import AllProducts from "../Pages/Products/AllProducts";
import SellerHome from "../Dashboard/Seller/SellerHome";
import MyProducts from "../Dashboard/Seller/MyProducts";
import AddProducts from "../Dashboard/Seller/AddProducts";
import SellerOrders from "../Dashboard/Seller/SellerOrders";
import SellerRoute from './SellerRoute';

export const router = createBrowserRouter([
  {
    path: "/",
    element: <MainLayout />,
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <Home />,
      },
      {
        path: "/all-products",
        element: <AllProducts />,
      },
      {
        path: "/login",
        element: <Login />,
      },
      {
        path: "/signup",
        element: <Signup />,
      },
      {
        path: "/reset-password",
        element: <ResetPassword />,
      },
    ],
  },
  {
    path: "/dashboard",
    element: (
      <PrivateRoute>
        <DashboardLayout />
      </PrivateRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      {
        index: true,
        element: <DashboardRedirector />,
      },
      // // Admin Routes
      // { path: "admin-home", element: <AdminHome /> },
      // { path: "manage-users", element: <ManageUsers /> },
      // { path: "manage-products", element: <ManageProducts /> },
      // { path: "manage-orders", element: <ManageOrders /> },
      // { path: "analytics", element: <Analytics /> },

      // Seller Routes
      { path: "seller-home",
         element: <PrivateRoute>
          
            <SellerHome />
          
         </PrivateRoute> },
      { path: "my-products", element: <MyProducts /> },
      { path: "add-product", element: <AddProducts /> },
      { path: "seller-orders", element: <SellerOrders /> },

      // // Customer Routes
      // { path: "customer-home", element: <CustomerHome /> },
      // { path: "my-orders", element: <MyOrders /> },
      // { path: "my-wishlist", element: <MyWishlist /> },
      // { path: "my-profile", element: <MyProfile /> },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);
