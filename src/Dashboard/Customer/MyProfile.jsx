import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../Context/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaUserCircle, FaEnvelope, FaTag, FaEdit, FaClipboardList, FaHeart, FaPlusSquare, FaBoxOpen } from 'react-icons/fa';
import EditProfileModal from './EditProfileModal';
import logo from '../../assets/Logo.png';

const MyProfile = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [showEditModal, setShowEditModal] = useState(false);

  // Helper to safely parse numbers
  const parseNumber = (value) => {
    if (typeof value === 'object' && value !== null && (value?.$numberInt !== undefined || value?.$numberDouble !== undefined)) {
      return parseFloat(value.$numberInt || value.$numberDouble);
    }
    return parseFloat(value) || 0;
  };

  // Fetch user role from backend
  const { data: userRoleData, isLoading: isRoleLoading, isError: isRoleError, error: roleError } = useQuery({
    queryKey: ['userRole', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const { data } = await axiosSecure.get(`/user/role/${user.email}`);
      return data;
    },
    enabled: !!user?.email,
  });

  // Fetch customer's order and wishlist data
  const { data: customerData, isLoading: isCustomerDataLoading } = useQuery({
    queryKey: ['customerDashboardSummary', user?.email],
    queryFn: async () => {
        if (!user?.email) return { totalOrders: 0, totalWishlistItems: 0 };
        const orders = await axiosSecure.get(`/customer/orders/${user.email}`).then(res => res.data);
        const wishlist = await axiosSecure.get(`/customer/wishlist/${user.email}`).then(res => res.data);
        return {
            totalOrders: orders.length,
            totalWishlistItems: wishlist.items?.length || 0
        };
    },
    enabled: userRoleData?.role === 'customer' && !!user?.email,
  });

  // Fetch seller's dashboard data
  const { data: sellerData, isLoading: isSellerDataLoading } = useQuery({
    queryKey: ['sellerDashboardSummary', user?.email],
    queryFn: async () => {
        if (!user?.email) return null;
        const { data } = await axiosSecure.get(`/seller/dashboard-summary/${user.email}`);
        return data;
    },
    enabled: userRoleData?.role === 'seller' && !!user?.email,
  });

  const displayRole = userRoleData?.role || 'N/A';
  const dataLoading = authLoading || isRoleLoading || isCustomerDataLoading || isSellerDataLoading;

  if (dataLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Skeleton circle height={120} width={120} className="mb-4" />
        <Skeleton height={30} width="60%" className="mb-2" />
        <Skeleton height={20} width="40%" className="mb-4" />
        <Skeleton height={20} width="30%" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 p-8">
        <p>আপনি লগইন করেননি। প্রোফাইল দেখতে লগইন করুন।</p>
      </div>
    );
  }

  if (isRoleError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500 p-8">
        <p>রোল লোড করতে ব্যর্থ: {roleError.message}</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-white rounded-lg shadow-md max-w-2xl mx-auto text-center"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">আমার প্রোফাইল</h1>
      
      <div className="flex flex-col items-center space-y-4">
        <motion.div
          initial={{ scale: 0.8, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="w-32 h-32 rounded-full overflow-hidden shadow-lg border-4 border-blue-200 flex items-center justify-center bg-gray-100"
        >
          {user.photoURL ? (
            <img src={user.photoURL} alt={user.displayName || 'User'} className="w-full h-full object-cover" />
          ) : (
            <FaUserCircle className="text-gray-400 text-6xl" />
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="space-y-2"
        >
          <h2 className="text-2xl font-bold text-gray-900">{user.displayName || 'নাম পাওয়া যায়নি'}</h2>
          <p className="text-gray-700 flex items-center justify-center">
            <FaEnvelope className="mr-2 text-blue-500" /> {user.email}
          </p>
          <p className="text-gray-700 flex items-center justify-center capitalize">
            <FaTag className="mr-2 text-purple-500" /> রোল: {displayRole}
          </p>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="btn btn-outline btn-primary mt-4 flex items-center"
          onClick={() => setShowEditModal(true)}
        >
          <FaEdit className="mr-2" /> প্রোফাইল এডিট করুন
        </motion.button>
      </div>

      <div className="mt-10 border-t pt-8 space-y-6 text-left">
        <h3 className="text-xl font-bold text-gray-800 mb-4">অতিরিক্ত তথ্য</h3>
        
        {displayRole === 'customer' && customerData && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.8 }}
                className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200"
            >
                <h4 className="text-lg font-semibold text-blue-700 mb-1 flex items-center gap-2"><FaClipboardList /> মোট অর্ডার</h4>
                <p className="text-3xl font-bold text-blue-900">{customerData.totalOrders}</p>
            </motion.div>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ duration: 0.5, delay: 0.9 }}
                className="bg-pink-50 p-4 rounded-lg shadow-sm border border-pink-200"
            >
                <h4 className="text-lg font-semibold text-pink-700 mb-1 flex items-center gap-2"><FaHeart /> পছন্দের তালিকায়</h4>
                <p className="text-3xl font-bold text-pink-900">{customerData.totalWishlistItems}</p>
            </motion.div>
          </div>
        )}

        {displayRole === 'seller' && sellerData && (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.2, duration: 0.5 }}
                className="bg-purple-50 p-6 rounded-lg shadow-sm border border-purple-200"
            >
                <h3 className="text-lg font-semibold text-purple-700 mb-2">Total Products</h3>
                <p className="text-3xl font-bold text-purple-900">{sellerData.totalProducts}</p>
            </motion.div>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.4, duration: 0.5 }}
                className="bg-orange-50 p-6 rounded-lg shadow-sm border border-orange-200"
            >
                <h3 className="text-lg font-semibold text-orange-700 mb-2">Pending Order</h3>
                <p className="text-3xl font-bold text-orange-900">{sellerData.pendingOrders}</p>
            </motion.div>
            <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.6, duration: 0.5 }}
                className="bg-teal-50 p-6 rounded-lg shadow-sm border border-teal-200"
            >
                <h3 className="text-lg font-semibold text-teal-700 mb-2">Total Sell</h3>
                <p className="text-3xl font-bold text-teal-900">৳{parseNumber(sellerData.totalSales).toFixed(2)}</p>
            </motion.div>
          </div>
        )}

        {!['customer', 'seller', 'admin'].includes(displayRole) && (
          <p className="text-gray-600">আপনার জন্য কোনো অতিরিক্ত তথ্য নেই।</p>
        )}
      </div>
      
      {/* Edit Profile Modal */}
      <AnimatePresence>
        {showEditModal && user && (
          <EditProfileModal
            user={user}
            userRole={displayRole}
            onClose={() => setShowEditModal(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MyProfile;