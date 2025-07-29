import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthProvider';
import { motion } from 'framer-motion';

const AdminHome = () => {
  const { user } = useContext(AuthContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white rounded-lg shadow-md"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {user?.displayName || 'Admin'}! 👋</h1>
      <p className="text-gray-600">This is your Admin Dashboard. Here you can manage all aspects of Jonoprio.com.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-200"
        >
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Total Users</h3>
          <p className="text-4xl font-extrabold text-blue-900">5,432</p>
        </motion.div>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-200"
        >
          <h3 className="text-xl font-semibold text-green-700 mb-2">Total Sales</h3>
          <p className="text-4xl font-extrabold text-green-900">৳ 12,34,567</p>
        </motion.div>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-yellow-50 p-6 rounded-lg shadow-sm border border-yellow-200"
        >
          <h3 className="text-xl font-semibold text-yellow-700 mb-2">Pending Orders</h3>
          <p className="text-4xl font-extrabold text-yellow-900">78</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default AdminHome;