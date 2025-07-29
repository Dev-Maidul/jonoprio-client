import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthProvider';
import { motion } from 'framer-motion';

const CustomerHome = () => {
  const { user } = useContext(AuthContext);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white rounded-lg shadow-md"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Hello, {user?.displayName || 'Customer'}! 👋</h1>
      <p className="text-gray-600">Welcome to your personalized Jonoprio.com Dashboard.</p>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-200"
        >
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Total Orders</h3>
          <p className="text-4xl font-extrabold text-blue-900">15</p>
        </motion.div>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-pink-50 p-6 rounded-lg shadow-sm border border-pink-200"
        >
          <h3 className="text-xl font-semibold text-pink-700 mb-2">Items in Wishlist</h3>
          <p className="text-4xl font-extrabold text-pink-900">7</p>
        </motion.div>
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-indigo-50 p-6 rounded-lg shadow-sm border border-indigo-200"
        >
          <h3 className="text-xl font-semibold text-indigo-700 mb-2">Last Order Status</h3>
          <p className="text-2xl font-bold text-indigo-900 mt-2">Delivered</p>
          <p className="text-sm text-gray-500">on Jul 20, 2025</p>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default CustomerHome;