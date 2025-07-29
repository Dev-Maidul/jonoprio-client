import React from 'react';
import { NavLink } from 'react-router-dom';
import { FaHome, FaUsers, FaBox, FaClipboardList, FaChartBar } from 'react-icons/fa';
import { motion } from 'framer-motion';

const AdminMenu = () => {
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
                    to="/dashboard/admin-home"
                    className={({ isActive }) =>
                        isActive
                            ? "flex items-center px-4 py-2 text-indigo-700 bg-indigo-200 rounded-lg font-semibold transition duration-200"
                            : "flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition duration-200"
                    }
                >
                    <FaHome className="mr-3" /> Admin Home
                </NavLink>
            </motion.li>

            <motion.li variants={itemVariants}>
                <NavLink
                    to="/dashboard/manage-users"
                    className={({ isActive }) =>
                        isActive
                            ? "flex items-center px-4 py-2 text-indigo-700 bg-indigo-200 rounded-lg font-semibold transition duration-200"
                            : "flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition duration-200"
                    }
                >
                    <FaUsers className="mr-3" /> Manage Users
                </NavLink>
            </motion.li>

            <motion.li variants={itemVariants}>
                <NavLink
                    to="/dashboard/manage-products"
                    className={({ isActive }) =>
                        isActive
                            ? "flex items-center px-4 py-2 text-indigo-700 bg-indigo-200 rounded-lg font-semibold transition duration-200"
                            : "flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition duration-200"
                    }
                >
                    <FaBox className="mr-3" /> Manage Products
                </NavLink>
            </motion.li>

            <motion.li variants={itemVariants}>
                <NavLink
                    to="/dashboard/manage-orders"
                    className={({ isActive }) =>
                        isActive
                            ? "flex items-center px-4 py-2 text-indigo-700 bg-indigo-200 rounded-lg font-semibold transition duration-200"
                            : "flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition duration-200"
                    }
                >
                    <FaClipboardList className="mr-3" /> Manage Orders
                </NavLink>
            </motion.li>

            <motion.li variants={itemVariants}>
                <NavLink
                    to="/dashboard/analytics"
                    className={({ isActive }) =>
                        isActive
                            ? "flex items-center px-4 py-2 text-indigo-700 bg-indigo-200 rounded-lg font-semibold transition duration-200"
                            : "flex items-center px-4 py-2 text-gray-700 hover:bg-indigo-100 hover:text-indigo-700 rounded-lg transition duration-200"
                    }
                >
                    <FaChartBar className="mr-3" /> Analytics
                </NavLink>
            </motion.li>
        </motion.ul>
    );
};

export default AdminMenu;