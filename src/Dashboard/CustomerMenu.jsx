import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaShoppingBag, FaHeart, FaUserCircle } from 'react-icons/fa';
import { motion } from 'framer-motion';

const CustomerMenu = () => {
  const itemVariants = {
    hidden: { opacity: 0, x: -20 },
    visible: { opacity: 1, x: 0, transition: { duration: 0.3 } },
  };

  return (
    <motion.ul
      initial="hidden"
      animate="visible"
      variants={{
        visible: {
          transition: {
            staggerChildren: 0.1,
          },
        },
      }}
      className="space-y-2"
    >
      <motion.li variants={itemVariants}>
        <NavLink
          to="/dashboard/customer-home"
          className={({ isActive }) =>
            isActive
              ? "flex items-center px-4 py-2 text-indigo-700 bg-indigo-200 rounded-lg font-semibold transition duration-200"
              : "flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition duration-200"
          }
        >
          <FaHome className="mr-3" /> Home
        </NavLink>
      </motion.li>

      <motion.li variants={itemVariants}>
        <NavLink
          to="/dashboard/my-orders"
          className={({ isActive }) =>
            isActive
              ? "flex items-center px-4 py-2 text-indigo-700 bg-indigo-200 rounded-lg font-semibold transition duration-200"
              : "flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition duration-200"
          }
        >
          <FaShoppingBag className="mr-3" /> My Orders
        </NavLink>
      </motion.li>

      <motion.li variants={itemVariants}>
        <NavLink
          to="/dashboard/my-wishlist"
          className={({ isActive }) =>
            isActive
              ? "flex items-center px-4 py-2 text-indigo-700 bg-indigo-200 rounded-lg font-semibold transition duration-200"
              : "flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition duration-200"
          }
        >
          <FaHeart className="mr-3" /> My Wishlist
        </NavLink>
      </motion.li>

      <motion.li variants={itemVariants}>
        <NavLink
          to="/dashboard/my-profile"
          className={({ isActive }) =>
            isActive
              ? "flex items-center px-4 py-2 text-indigo-700 bg-indigo-200 rounded-lg font-semibold transition duration-200"
              : "flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition duration-200"
          }
        >
          <FaUserCircle className="mr-3" /> My Profile
        </NavLink>
      </motion.li>
    </motion.ul>
  );
};

export default CustomerMenu;