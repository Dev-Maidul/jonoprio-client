import React, { useContext, useEffect, useState } from 'react';
import { Outlet, NavLink, useNavigate } from 'react-router-dom';
import { AuthContext } from '../Context/AuthProvider';
import toast from 'react-hot-toast';
import axios from 'axios';
import { FaBars, FaTimes } from 'react-icons/fa';
import AdminMenu from './Admin/AdminMenu';
import CustomerMenu from './CustomerMenu';
import SellerMenu from './Seller/SellerMenu';

const DashboardLayout = () => {
  const { user, loading, logOut } = useContext(AuthContext);
  const [userRole, setUserRole] = useState(null);
  const [isRoleLoading, setIsRoleLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchUserRole = async () => {
      if (user && user.email) {
        try {
          setIsRoleLoading(true);
          // Update the URL to point to the correct API
          const response = await axios.get(`http://localhost:3000/user/role/${user.email}`);
          setUserRole(response.data.role);
        } catch (error) {
          toast.error("Failed to load user role. Please try again.");
          setUserRole(null);
          if (error.response && (error.response.status === 401 || error.response.status === 403)) {
            logOut();
            navigate('/login');
          }
        } finally {
          setIsRoleLoading(false);
        }
      } else if (!loading) {
        setUserRole(null);
        setIsRoleLoading(false);
        navigate('/login');
      }
    };

    fetchUserRole();
  }, [user, loading, logOut, navigate]);

  if (loading || isRoleLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }

  if (!userRole) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: Could not determine user role or user not logged in.
      </div>
    );
  }

  const renderMenu = () => {
    if (userRole === 'admin') {
      return <AdminMenu />;
    } else if (userRole === 'seller') {
      return <SellerMenu/>;
    } else if (userRole === 'customer') {
      return <CustomerMenu />;
    }
    return <p className="text-center text-gray-500">No menu available for this role.</p>;
  };

  return (
    <div className="flex min-h-screen">
      <div className="lg:hidden fixed top-0 left-0 z-50 p-4 bg-white shadow-md w-full flex justify-between items-center">
        <button onClick={() => setSidebarOpen(!sidebarOpen)} className="text-gray-700 text-2xl">
          {sidebarOpen ? <FaTimes /> : <FaBars />}
        </button>
        <h1 className="text-xl font-bold text-gray-800">Dashboard</h1>
      </div>

      <div
        className={`fixed lg:static w-64 bg-gradient-to-br from-purple-50 to-indigo-100 p-6 shadow-lg transform ${
          sidebarOpen ? 'translate-x-0' : '-translate-x-full'
        } lg:translate-x-0 transition-transform duration-300 ease-in-out z-40`}
      >
        <h2 className="text-2xl font-bold text-gray-800 mb-8 text-center">
          Jonoprio Dashboard
        </h2>
        <ul className="space-y-2">
          {renderMenu()}
          <div className="divider"></div>
          <li>
            <NavLink
              to="/"
              className={({ isActive }) =>
                isActive
                  ? "flex items-center px-4 py-2 text-indigo-700 bg-indigo-200 rounded-lg font-semibold transition duration-200"
                  : "flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition duration-200"
              }
              onClick={() => setSidebarOpen(false)}
            >
              Home
            </NavLink>
          </li>
          <li>
            <button
              onClick={logOut}
              className="flex items-center w-full px-4 py-2 text-red-600 hover:bg-red-100 rounded-lg font-semibold transition duration-200"
            >
              Logout
            </button>
          </li>
        </ul>
      </div>

      <div className={`flex-1 py-8 px-8 lg:ml-0 ${sidebarOpen ? 'ml-64' : 'ml-0'} transition-all duration-300 ease-in-out`}>
        <div className="mt-16 lg:mt-0">
          <Outlet />
        </div>
      </div>
    </div>
  );
};

export default DashboardLayout;
