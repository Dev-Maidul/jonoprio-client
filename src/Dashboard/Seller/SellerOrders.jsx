import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { AuthContext } from '../../Context/AuthProvider';
import toast from 'react-hot-toast';
import { FaEye, FaClock, FaShippingFast, FaBoxOpen, FaCheckCircle, FaTimesCircle } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import OrderDetailsModal from './OrderDetailsModal'; // Import the modal component

const SellerOrders = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [filterStatus, setFilterStatus] = useState('All');
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  // Parse numbers from MongoDB Extended JSON
  const parseNumber = (value) => {
    if (typeof value === 'object' && value !== null && (value?.$numberInt !== undefined || value?.$numberDouble !== undefined)) {
      return parseFloat(value.$numberInt || value.$numberDouble);
    }
    return parseFloat(value) || 0;
  };

  // Fetch seller's orders
  const { data: orders, isLoading, isError, error } = useQuery({
    queryKey: ['sellerOrders', user?.email, filterStatus],
    queryFn: async () => {
      if (!user?.email) return [];
      let url = `/seller/orders/${user.email}`;
      const { data } = await axiosSecure.get(url);

      if (filterStatus === 'All') {
        return data;
      }
      return data.filter(order => order.status === filterStatus);
    },
    enabled: !!user?.email,
  });

  // Mutation for updating order status
  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const { data } = await axiosSecure.put(`/order/status/${orderId}`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['sellerOrders', user?.email, filterStatus]);
      toast.success('Order status updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update order status.');
    },
  });

  // Handle status change
  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatusMutation.mutate({ orderId, status: newStatus });
  };

  // Show order details modal
  const handleViewDetails = (order) => {
    setSelectedOrder(order);
    setShowOrderDetailsModal(true);
  };

  const getStatusIcon = (status) => {
    switch (status) {
      case 'pending': return <FaClock className="text-yellow-500" />;
      case 'processing': return <FaShippingFast className="text-blue-500" />;
      case 'shipped': return <FaBoxOpen className="text-indigo-500" />;
      case 'delivered': return <FaCheckCircle className="text-green-500" />;
      case 'cancelled': return <FaTimesCircle className="text-red-500" />;
      default: return null;
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
        <p className="text-gray-600 text-lg">No orders found for your products.</p>
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
      <h1 className="text-3xl font-bold text-gray-800 mb-8">Manage Orders</h1>

      {/* Filters and Search */}
      <div className="mb-6 flex flex-wrap gap-4 items-center">
        <div className="form-control">
          <label className="label">
            <span className="label-text">Filter by Status:</span>
          </label>
          <select
            className="select select-bordered"
            value={filterStatus}
            onChange={(e) => setFilterStatus(e.target.value)}
          >
            <option value="All">All</option>
            <option value="pending">Pending</option>
            <option value="processing">Processing</option>
            <option value="shipped">Shipped</option>
            <option value="delivered">Delivered</option>
            <option value="cancelled">Cancelled</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr className="bg-gray-100 text-gray-700 uppercase text-sm leading-normal">
              <th className="py-3 px-6 text-left">Order ID</th>
              <th className="py-3 px-6 text-left">Customer</th>
              <th className="py-3 px-6 text-left">Date</th>
              <th className="py-3 px-6 text-right">Total</th>
              <th className="py-3 px-6 text-center">Status</th>
              <th className="py-3 px-6 text-center">Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {orders.map(order => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 border-b border-gray-200"
                >
                  <td className="py-3 px-6 text-left text-sm font-medium">{order._id.substring(0, 8)}...</td>
                  <td className="py-3 px-6 text-left text-sm">{order.customerInfo?.name}</td>
                  <td className="py-3 px-6 text-left text-sm">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="py-3 px-6 text-right text-sm font-bold">৳{parseNumber(order.totalAmount).toFixed(2)}</td>
                  <td className="py-3 px-6 text-center">
                    <div className="flex items-center justify-center space-x-1 capitalize text-sm font-medium">
                      {getStatusIcon(order.status)}
                      <span>{order.status}</span>
                    </div>
                  </td>
                  <td className="py-3 px-6 text-center">
                    <button
                      className="btn btn-ghost btn-xs text-blue-500 hover:text-blue-700"
                      onClick={() => handleViewDetails(order)}
                    >
                      <FaEye className="mr-1" /> Details
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      {/* Order Details Modal */}
      <AnimatePresence>
        {showOrderDetailsModal && selectedOrder && (
          <OrderDetailsModal
            order={selectedOrder}
            onClose={() => setShowOrderDetailsModal(false)}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default SellerOrders;
