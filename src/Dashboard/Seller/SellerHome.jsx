import React from 'react';
import { useContext } from 'react';
import { AuthContext } from '../../Context/AuthProvider';
import { motion } from 'framer-motion';

const SellerHome = () => {
    const { user } = useContext(AuthContext);

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-white rounded-lg "
        >
            <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {user?.displayName || 'Seller'}! 👋</h1>
            <p className="text-gray-600">This is your Seller Dashboard. Manage your products and orders here.</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    transition={{ delay: 0.2, duration: 0.5 }}
                    className="bg-purple-50 p-6 rounded-lg shadow-sm border border-purple-200"
                >
                    <h3 className="text-xl font-semibold text-purple-700 mb-2">Total Products</h3>
                    <p className="text-4xl font-extrabold text-purple-900">125</p>
                </motion.div>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    transition={{ delay: 0.4, duration: 0.5 }}
                    className="bg-orange-50 p-6 rounded-lg shadow-sm border border-orange-200"
                >
                    <h3 className="text-xl font-semibold text-orange-700 mb-2">Pending Seller Orders</h3>
                    <p className="text-4xl font-extrabold text-orange-900">12</p>
                </motion.div>
                <motion.div 
                    initial={{ scale: 0.9, opacity: 0 }} 
                    animate={{ scale: 1, opacity: 1 }} 
                    transition={{ delay: 0.6, duration: 0.5 }}
                    className="bg-teal-50 p-6 rounded-lg shadow-sm border border-teal-200"
                >
                    <h3 className="text-xl font-semibold text-teal-700 mb-2">Your Total Sales</h3>
                    <p className="text-4xl font-extrabold text-teal-900">৳ 2,50,000</p>
                </motion.div>
            </div>
            {/* You can add more seller-specific widgets here */}
        </motion.div>
    );
};

export default SellerHome;