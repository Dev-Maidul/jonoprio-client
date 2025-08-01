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
import SellerRoute from "./SellerRoute";
import ProductDetails from "../Pages/Products/ProductDetails";
import EditProduct from "../Dashboard/Seller/EditProduct";
import CheckoutPage from "../Pages/Products/CheckoutPage";
import ThankYouPage from "../Pages/Products/ThankYouPage";
import CustomerHome from "../Dashboard/Customer/CustomerHome";
import MyOrders from "../Dashboard/Customer/MyOrders";
import MyWishlist from "../Dashboard/Customer/MyWishlist";
import MyProfile from "../Dashboard/Customer/MyProfile";
import AdminHome from "../Dashboard/Admin/AdminHome";
import ManageUsers from "../Dashboard/Admin/ManageUsers";
import ManageProducts from "../Dashboard/Admin/ManageProducts";
import ManageOrders from "../Dashboard/Admin/ManageOrders";
import Analytics from "../Dashboard/Admin/Analytics";
import AdminUpdateProduct from "../Dashboard/Admin/AdminUpdateProduct";
import OrderDetails from "../Dashboard/Admin/OrderDetails";
import ContactPage from "../Components/ContactPage";
import WholesalePage from "../Components/WholesalePage";
import NotificationsPage from "../Components/NotificationsPage";
import CartPage from "../Components/CartPage";

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
        path: "all-products",
        element: <AllProducts />,
      },
      {
        path: "contact",
        element: <ContactPage />,
      },
      {
        path: "wholesale",
        element: <WholesalePage />,
      },
      {
        path: "product/:id",
        element: <ProductDetails />,
      },
      {
        path: "login",
        element: <Login />,
      },
      {
        path: "signup",
        element: <Signup />,
      },
      {
        path: "reset-password",
        element: <ResetPassword />,
      },
      {
        path: "checkout",
        element: <CheckoutPage />,
      },
      {
        path: "thank-you",
        element: <ThankYouPage />,
      },
      {
        path: "notifications",
        element: <NotificationsPage />,
      },
      {
        path: "cart",
        element: <CartPage />,
      },
    ],
  },
  {
    path: "dashboard",
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
      // Admin Routes
      { 
        path: "admin-home", 
        element: <AdminHome /> 
      },
      { 
        path: "manage-users", 
        element: <ManageUsers /> 
      },
      { 
        path: "manage-products", 
        element: <ManageProducts /> 
      },
      { 
        path: "manage-orders", 
        element: <ManageOrders /> 
      },
      { 
        path: "analytics", 
        element: <Analytics /> 
      },
      { 
        path: "order/:orderId", 
        element: <OrderDetails /> 
      },
      {
        path: "admin/update-product/:productId",
        element: <AdminUpdateProduct />,
      },

      // Seller Routes
      {
        path: "seller-home",
        element: (
          <SellerRoute>
            <SellerHome />
          </SellerRoute>
        ),
      },
      { 
        path: "my-products", 
        element: <MyProducts /> 
      },
      { 
        path: "add-product", 
        element: <AddProducts /> 
      },
      { 
        path: "seller-orders", 
        element: <SellerOrders /> 
      },
      { 
        path: "edit-product/:id", 
        element: <EditProduct /> 
      },
      
      // Customer Routes
      { 
        path: "customer-home", 
        element: <CustomerHome /> 
      },
      { 
        path: "my-orders", 
        element: <MyOrders /> 
      },
      { 
        path: "my-wishlist", 
        element: <MyWishlist /> 
      },
      { 
        path: "my-profile", 
        element: <MyProfile /> 
      },
    ],
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);