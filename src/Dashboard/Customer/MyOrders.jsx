import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { AuthContext } from '../../Context/AuthProvider';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaEye, FaClock, FaShippingFast, FaCheckCircle, FaTimesCircle, FaBoxOpen } from 'react-icons/fa';
import CustomerOrderDetailsModal from './CustomerOrderDetailsModal'; // Import the new modal component

const BASE64_FALLBACK_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXRSTlMAQObYZgAAAFpJUVORK5CYII=';

const MyOrders = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Parse numbers from MongoDB Extended JSON
  const parseNumber = (value) => {
    if (typeof value === 'object' && value !== null && (value?.$numberInt !== undefined || value?.$numberDouble !== undefined)) {
      return parseFloat(value.$numberInt || value.$numberDouble);
    }
    return parseFloat(value) || 0;
  };

  // Fetch customer's orders
  const { data: orders, isLoading, isError, error } = useQuery({
    queryKey: ['customerOrders', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      let url = `/customer/orders/${user.email}`;
      const { data } = await axiosSecure.get(url);
      return data;
    },
    enabled: !!user?.email,
  });

  // Show order details modal
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailsModal(true);
  };

  const getStatusBadge = (status) => {
    switch (status) {
      case 'pending': return <span className="badge badge-warning gap-2 text-white"><FaClock /> Pending</span>;
      case 'processing': return <span className="badge badge-info gap-2 text-white"><FaShippingFast /> Processing</span>;
      case 'shipped': return <span className="badge badge-primary gap-2 text-white"><FaBoxOpen /> Shipped</span>;
      case 'delivered': return <span className="badge badge-success gap-2 text-white"><FaCheckCircle /> Delivered</span>;
      case 'cancelled': return <span className="badge badge-error gap-2 text-white"><FaTimesCircle /> Cancelled</span>;
      default: return <span className="badge badge-ghost">Unknown</span>;
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8">
        <Skeleton height={500} width="100%" />
      </div>
    );
  }

  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error.message}
      </div>
    );
  }

  if (!orders || orders.length === 0) {
    return (
      <div className="p-8 bg-white rounded-lg shadow-md min-h-[200px] flex items-center justify-center">
        <p className="text-gray-600 text-lg">আপনার কোন অর্ডার নেই।</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-white rounded-lg shadow-md"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-8">আমার অর্ডারসমূহ</h1>

      {/* Table for Orders */}
      <table className="min-w-full bg-white table-auto">
        <thead>
          <tr className="bg-gray-100">
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Order ID</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Order Date</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Total Amount</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Status</th>
            <th className="px-6 py-3 text-left text-sm font-semibold text-gray-600">Actions</th>
          </tr>
        </thead>
        <tbody>
          {orders.map((order) => (
            <tr key={order._id} className="border-b">
              <td className="px-6 py-4 text-sm text-gray-800">{order._id.substring(0, 8)}...</td>
              <td className="px-6 py-4 text-sm text-gray-600">{new Date(order.orderDate).toLocaleDateString()}</td>
              <td className="px-6 py-4 text-sm text-gray-800">৳{parseNumber(order.totalAmount).toFixed(2)}</td>
              <td className="px-6 py-4 text-sm text-gray-800">{getStatusBadge(order.status)}</td>
              <td className="px-6 py-4 text-sm">
                <button
                  className="btn btn-primary btn-sm"
                  onClick={() => handleViewDetails(order)}
                >
                  <FaEye className="mr-1" /> View Details
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showOrderDetailsModal && selectedOrder && (
          <CustomerOrderDetailsModal
            order={selectedOrder}
            onClose={() => setShowOrderDetailsModal(false)}
            parseNumber={parseNumber}
            BASE64_FALLBACK_IMAGE={BASE64_FALLBACK_IMAGE}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default MyOrders;
