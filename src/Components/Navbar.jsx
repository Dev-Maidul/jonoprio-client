import React, { useState, useEffect } from "react";
import { Link, NavLink, useNavigate } from "react-router-dom";
import { motion } from "framer-motion";
import logo1 from "../assets/Logo1.png";
import toast from "react-hot-toast";
import useAuth from '../Hooks/useAuth';
import useCart from '../Hooks/useCart';
import { FiLogOut, FiUser, FiHome, FiShoppingBag, FiShoppingCart, FiBell, FiMail, FiTruck, FiTrash2, FiPlus, FiMinus } from "react-icons/fi";

const Navbar = () => {
  const { user, logOut } = useAuth();
  const { cart, updateQuantity, removeItem, getTotalItems, getSubtotal } = useCart();
  const navigate = useNavigate();
  const [menuOpen, setMenuOpen] = useState(false);
  const [notificationOpen, setNotificationOpen] = useState(false);
  const [cartOpen, setCartOpen] = useState(false);
  const [notifications, setNotifications] = useState([]);
  const [unreadCount, setUnreadCount] = useState(0);

  useEffect(() => {
    const mockNotifications = [
      { id: 1, message: "Your order #1234 has shipped", time: "2 hours ago", read: false },
      { id: 2, message: "New products added to your wishlist", time: "1 day ago", read: true },
      { id: 3, message: "Special discount available", time: "3 days ago", read: true },
    ];
    setNotifications(mockNotifications);
    setUnreadCount(mockNotifications.filter(n => !n.read).length);
  }, []);

  const handleLogout = async () => {
    try {
      await logOut();
      toast.success("Successfully logged out!");
      navigate("/login");
    } catch (error) {
      toast.error("Logout failed. Please try again.");
    }
  };

  const markAsRead = (id) => {
    setNotifications(notifications.map(n => 
      n.id === id ? {...n, read: true} : n
    ));
    setUnreadCount(prev => prev - 1);
  };

  const handleQuantityChange = (productId, change) => {
    const item = cart.find(item => item._id.$oid === productId);
    if (!item) return;
    
    const currentQty = parseInt(item.quantity.$numberInt);
    const newQty = currentQty + change;
    
    if (newQty > 0) {
      updateQuantity(productId, newQty);
    } else if (newQty === 0) {
      removeItem(productId);
    }
  };

  const navItems = (
    <>
      <li>
        <NavLink
          to="/"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? "bg-indigo-100 text-indigo-700 font-semibold"
                : "hover:bg-gray-50 text-gray-800 font-medium"
            }`
          }
          onClick={() => setMenuOpen(false)}
        >
          <FiHome className="text-lg" />
          Home
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/all-products"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? "bg-indigo-100 text-indigo-700 font-semibold"
                : "hover:bg-gray-50 text-gray-800 font-medium"
            }`
          }
          onClick={() => setMenuOpen(false)}
        >
          <FiShoppingBag className="text-lg" />
          Products
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/wholesale"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? "bg-indigo-100 text-indigo-700 font-semibold"
                : "hover:bg-gray-50 text-gray-800 font-medium"
            }`
          }
          onClick={() => setMenuOpen(false)}
        >
          <FiTruck className="text-lg" />
          Wholesale
        </NavLink>
      </li>
      <li>
        <NavLink
          to="/contact"
          className={({ isActive }) =>
            `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
              isActive
                ? "bg-indigo-100 text-indigo-700 font-semibold"
                : "hover:bg-gray-50 text-gray-800 font-medium"
            }`
          }
          onClick={() => setMenuOpen(false)}
        >
          <FiMail className="text-lg" />
          Contact
        </NavLink>
      </li>
      {user && (
        <li>
          <NavLink
            to="/dashboard"
            className={({ isActive }) =>
              `flex items-center gap-2 px-4 py-2 rounded-lg transition-colors ${
                isActive
                  ? "bg-indigo-100 text-indigo-700 font-semibold"
                  : "hover:bg-gray-50 text-gray-800 font-medium"
              }`
            }
            onClick={() => setMenuOpen(false)}
          >
            <FiUser className="text-lg" />
            Dashboard
          </NavLink>
        </li>
      )}
    </>
  );

  const NotificationDropdown = () => (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-4">
      <div className="flex justify-between items-center mb-3">
        <h3 className="font-semibold text-gray-900">Notifications</h3>
        {unreadCount > 0 && (
          <button 
            onClick={() => {
              setNotifications(notifications.map(n => ({...n, read: true})));
              setUnreadCount(0);
            }}
            className="text-xs text-indigo-600 hover:text-indigo-800 font-medium"
          >
            Mark all as read
          </button>
        )}
      </div>
      <div className="max-h-64 overflow-y-auto">
        {notifications.length > 0 ? (
          notifications.map(notification => (
            <div 
              key={notification.id} 
              className={`p-3 rounded-lg cursor-pointer mb-2 ${
                !notification.read ? "bg-blue-50" : "hover:bg-gray-50"
              }`}
              onClick={() => markAsRead(notification.id)}
            >
              <p className="text-sm text-gray-800">{notification.message}</p>
              <p className="text-xs text-gray-500 mt-1">{notification.time}</p>
            </div>
          ))
        ) : (
          <div className="p-4 text-center text-gray-500 text-sm">
            No notifications yet
          </div>
        )}
      </div>
      <div className="mt-3 text-center">
        <Link 
          to="/notifications" 
          className="text-sm text-indigo-600 hover:text-indigo-800 font-medium"
          onClick={() => setNotificationOpen(false)}
        >
          View all notifications
        </Link>
      </div>
    </div>
  );

  const CartDropdown = () => (
    <div className="absolute right-0 mt-2 w-80 bg-white rounded-xl shadow-lg border border-gray-200 z-50 p-4">
      <div className="mb-3">
        <h3 className="font-semibold text-gray-900">Your Cart ({getTotalItems()} items)</h3>
      </div>
      <div className="max-h-96 overflow-y-auto">
        {cart.length > 0 ? (
          <>
            {cart.slice(0, 3).map(item => (
              <div key={item._id.$oid} className="p-3 hover:bg-gray-50 border-b flex gap-3 mb-2">
                <img 
                  src={item.productImage} 
                  alt={item.productName} 
                  className="w-12 h-12 object-cover rounded-md"
                />
                <div className="flex-1">
                  <h4 className="text-sm font-medium line-clamp-1 text-gray-900">{item.productName}</h4>
                  <div className="flex items-center gap-2 mt-1">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(item._id.$oid, -1);
                      }}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <FiMinus className="text-xs text-gray-600" />
                    </button>
                    <span className="text-xs text-gray-700">
                      {parseInt(item.quantity.$numberInt)}
                    </span>
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleQuantityChange(item._id.$oid, 1);
                      }}
                      className="p-1 rounded-full hover:bg-gray-100"
                    >
                      <FiPlus className="text-xs text-gray-600" />
                    </button>
                  </div>
                </div>
                <div className="flex items-center gap-2">
                  <div className="text-sm font-medium text-gray-900">
                    ${(parseInt(item.price) * parseInt(item.quantity.$numberInt)).toLocaleString()}
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      removeItem(item._id.$oid);
                    }}
                    className="p-1 text-gray-400 hover:text-red-600 rounded-full hover:bg-red-50"
                  >
                    <FiTrash2 className="text-sm" />
                  </button>
                </div>
              </div>
            ))}
            {cart.length > 3 && (
              <div className="p-3 text-center text-sm text-gray-500">
                +{cart.length - 3} more items
              </div>
            )}
            <div className="p-3 border-t mt-2">
              <div className="flex justify-between mb-3">
                <span className="font-medium text-gray-800">Subtotal:</span>
                <span className="font-bold text-gray-900">${getSubtotal().toLocaleString()}</span>
              </div>
              <Link 
                to="/cart" 
                className="block w-full bg-indigo-600 text-white text-center py-2 rounded-md hover:bg-indigo-700 transition-colors"
                onClick={() => setCartOpen(false)}
              >
                View Cart
              </Link>
            </div>
          </>
        ) : (
          <div className="p-4 text-center text-gray-500">
            Your cart is empty
          </div>
        )}
      </div>
    </div>
  );

  const logoVariants = {
    hidden: { opacity: 0, x: -40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4 } },
  };
  const menuVariants = {
    hidden: { opacity: 0, y: -20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.3, delay: 0.1 } },
  };
  const userVariants = {
    hidden: { opacity: 0, x: 40 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.4, delay: 0.15 } },
  };

  return (
    <nav className="bg-white sticky top-0 z-50 shadow-md w-full border-b border-gray-100">
      <div className="px-4 md:px-6 lg:px-8 w-11/12 mx-auto">
        <div className="flex justify-between items-center h-20">
          {/* Logo - Always shown */}
          <motion.div
            className="flex items-center min-w-0"
            initial="hidden"
            animate="visible"
            variants={logoVariants}
          >
            <Link to="/" className="flex-shrink-0 md:hidden lg:block ">
              <img
                src={logo1}
                alt="Logo"
                className="h-10"
                style={{ objectFit: "contain" }}
              />
            </Link>
          </motion.div>

          {/* Desktop Menu - Shown only on md and above */}
          <motion.ul
            className="hidden md:flex gap-2 items-center text-base"
            initial="hidden"
            animate="visible"
            variants={menuVariants}
          >
            {navItems}
          </motion.ul>

          {/* Right Side Icons */}
          <motion.div
            className="flex items-center gap-4"
            initial="hidden"
            animate="visible"
            variants={userVariants}
          >
            {/* Cart Icon with Dropdown - Shown only when user is logged in */}
            {user && (
              <div className="relative">
                <button 
                  onClick={() => setCartOpen(!cartOpen)}
                  className="p-2 rounded-full hover:bg-gray-100 text-gray-800 transition-colors duration-200"
                >
                  <FiShoppingCart className="text-xl" />
                  {getTotalItems() > 0 && (
                    <span className="absolute -top-1 -right-1 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                      {getTotalItems()}
                    </span>
                  )}
                </button>
                {cartOpen && <CartDropdown />}
              </div>
            )}

            {user ? (
              <>
                {/* Notification Bell */}
                <div className="relative">
                  <button
                    onClick={() => setNotificationOpen(!notificationOpen)}
                    className="p-2 rounded-full hover:bg-gray-100 text-gray-800 transition-colors duration-200"
                  >
                    <FiBell className="text-xl" />
                    {unreadCount > 0 && (
                      <span className="absolute top-0 right-0 bg-red-600 text-white text-xs rounded-full h-5 w-5 flex items-center justify-center">
                        {unreadCount}
                      </span>
                    )}
                  </button>
                  {notificationOpen && <NotificationDropdown />}
                </div>

                {/* User Dropdown */}
                <div className="relative group">
                  <button className="flex items-center gap-2 hover:bg-gray-100 rounded-full p-2 transition-colors duration-200">
                    <img
                      src={user.photoURL}
                      alt={user.displayName}
                      className="w-9 h-9 rounded-full border-2 border-gray-200"
                    />
                    <span className="hidden md:inline text-sm font-medium text-gray-800">
                      {user.displayName?.split(' ')[0]}
                    </span>
                  </button>
                  <div className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-2 z-50 hidden group-hover:block border border-gray-100">
                    <Link
                      to="/profile"
                      className="flex items-center px-4 py-2 text-sm text-gray-800 hover:bg-gray-50"
                    >
                      <FiUser className="mr-2" />
                      Profile
                    </Link>
                    <button
                      onClick={handleLogout}
                      className="flex items-center w-full text-left px-4 py-2 text-sm text-gray-800 hover:bg-gray-50"
                    >
                      <FiLogOut className="mr-2" />
                      Logout
                    </button>
                  </div>
                </div>
              </>
            ) : (
              <>
                <div className="hidden md:flex items-center gap-2">
                  <Link
                    to="/login"
                    className="px-4 py-2 text-sm font-medium text-indigo-700 hover:text-indigo-900"
                  >
                    Login
                  </Link>
                  <Link
                    to="/signup"
                    className="px-4 py-2 text-sm font-medium text-white bg-indigo-700 hover:bg-indigo-800 rounded-md transition-colors"
                  >
                    Register
                  </Link>
                </div>
              </>
            )}

            {/* Mobile Menu Button */}
            <button
              className="md:hidden p-2 rounded-md hover:bg-gray-100"
              onClick={() => setMenuOpen(!menuOpen)}
              aria-label="Open Menu"
            >
              <svg
                className="w-6 h-6 text-gray-800"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d={menuOpen ? "M6 18L18 6M6 6l12 12" : "M4 6h16M4 12h16M4 18h16"}
                />
              </svg>
            </button>
          </motion.div>
        </div>
      </div>

      {/* Mobile Menu */}
      {menuOpen && (
        <motion.div
          className="md:hidden bg-white shadow-lg w-full border-t border-gray-100"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.25 }}
        >
          <ul className="flex flex-col gap-1 p-4">{navItems}</ul>
          {!user && (
            <div className="p-4 border-t flex flex-col gap-2">
              <Link
                to="/login"
                className="w-full text-center px-4 py-2 rounded-md text-indigo-700 border border-indigo-700 hover:bg-indigo-50"
                onClick={() => setMenuOpen(false)}
              >
                Login
              </Link>
              <Link
                to="/signup"
                className="w-full text-center px-4 py-2 rounded-md text-white bg-indigo-700 hover:bg-indigo-800"
                onClick={() => setMenuOpen(false)}
              >
                Register
              </Link>
            </div>
          )}
          {user && (
            <div className="p-4 border-t">
              <Link
                to="/profile"
                className="flex items-center gap-2 px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-800"
                onClick={() => setMenuOpen(false)}
              >
                <FiUser className="text-lg" />
                Profile
              </Link>
              <button
                onClick={handleLogout}
                className="flex items-center gap-2 w-full text-left px-4 py-2 rounded-lg hover:bg-gray-50 text-gray-800"
              >
                <FiLogOut className="text-lg" />
                Logout
              </button>
            </div>
          )}
        </motion.div>
      )}
    </nav>
  );
};

export default Navbar;