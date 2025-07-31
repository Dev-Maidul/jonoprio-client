import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { AuthContext } from '../../Context/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaUserCircle, FaEnvelope, FaTag, FaEdit } from 'react-icons/fa';
import EditProfileModal from './EditProfileModal'; 
import banner from '../../assets/Logo.png'
const MyProfile = () => {
  const { user, loading: authLoading } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [showEditModal, setShowEditModal] = useState(false); // Add state for modal

  const { data: userRoleData, isLoading: isRoleLoading, isError: isRoleError, error: roleError } = useQuery({
    queryKey: ['userRole', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const { data } = await axiosSecure.get(`/user/role/${user.email}`);
      return data;
    },
    enabled: !!user?.email,
  });

  const displayRole = userRoleData?.role || 'N/A';

  if (authLoading || isRoleLoading) {
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
      className="p-8  rounded-lg shadow-md max-w-2xl mx-auto text-center"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">আমার প্রোফাইল</h1>
      
      <div className="flex flex-col items-center space-y-4">
        {/* Profile Picture */}
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

        {/* User Information */}
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

        {/* Edit Profile Button */}
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="btn btn-outline btn-primary mt-4 flex items-center"
          onClick={() => setShowEditModal(true)} // Opens the modal
        >
          <FaEdit className="mr-2" /> প্রোফাইল এডিট করুন
        </motion.button>
      </div>

      {/* Additional Profile Sections (e.g., Order History, Wishlist - could be separate cards/sections) */}
      <div className="mt-10 border-t pt-8 space-y-6 text-left">
        <h3 className="text-xl font-bold text-gray-800 mb-4">অতিরিক্ত তথ্য (উদাহরণ)</h3>
        <p className="text-gray-700">এখানে ব্যবহারকারীর অর্ডারের ইতিহাস, পছন্দের তালিকা, ঠিকানা বা অন্যান্য ব্যক্তিগত তথ্য যোগ করা যেতে পারে।</p>
        <motion.div
            initial={{ scale: 0.9, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.8 }}
            className="bg-blue-50 p-4 rounded-lg shadow-sm border border-blue-200"
        >
            <h4 className="text-lg font-semibold text-blue-700 mb-1">মোট অর্ডার</h4>
            <p className="text-3xl font-bold text-blue-900">5</p>
        </motion.div>
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