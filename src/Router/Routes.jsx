import {
  createBrowserRouter,
  RouterProvider,
} from "react-router";
import ErrorPage from "../Components/ErrorPage";
import MainLayout from "../Layouts/MainLayout";
import Home from "../Pages/Home/Home";
import AllProducts from "../Pages/Products/AllProducts";
import Login from "../Components/Login";
import Signup from "../Components/SignUp";


 export const router = createBrowserRouter([
  {
    path: "/",
    element:<MainLayout></MainLayout>,
    children:[
      {
        index:true,
        element:<Home></Home>
      },
      {
        path:'/all-products',
        Component:AllProducts,
      },
      {
        path:'/login',
        Component: Login
      },
      {
        path:'/signup',
        Component: Signup
      }
    ]
  },
  {
    path: "*",
    element: <ErrorPage />,
  },
]);