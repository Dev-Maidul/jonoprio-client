import React, { useState, useContext } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { AuthContext } from '../../Context/AuthProvider';
import toast from 'react-hot-toast';
import { FaEye, FaTimesCircle, FaClock, FaShippingFast, FaCheckCircle, FaBoxOpen } from 'react-icons/fa';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import OrderDetailsModal from './OrderDetailsModal';

const SellerOrders = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [filterStatus, setFilterStatus] = useState('All');
  const [timeFilter, setTimeFilter] = useState('All');
  const [showOrderDetailsModal, setShowOrderDetailsModal] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);

  const BASE64_FALLBACK_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAGQAAABkCAYAAABw4pVUAAA...'; // replace this with actual base64 image string

  const parseNumber = (value) => {
    if (typeof value === 'object' && value !== null && (value?.$numberInt !== undefined || value?.$numberDouble !== undefined)) {
      return parseFloat(value.$numberInt || value.$numberDouble);
    }
    return parseFloat(value) || 0;
  };

  // Function to get the difference in days between two dates
  const getDaysDifference = (orderDate, today) => {
    const orderDateObj = new Date(orderDate);
    const diffTime = Math.abs(today - orderDateObj);
    return Math.floor(diffTime / (1000 * 60 * 60 * 24));
  };

  const { data: orders = [], isLoading, isError, error } = useQuery({
    queryKey: ['sellerOrders', user?.email, filterStatus, timeFilter],
    queryFn: async () => {
      if (!user?.email) return [];
      const today = new Date();
      let url = `/seller/orders/${user.email}`;
      const { data } = await axiosSecure.get(url);

      // Apply time filter
      const filteredOrders = data.filter(order => {
        const orderDate = new Date(order.orderDate);
        switch (timeFilter) {
          case '24h':
            return getDaysDifference(order.orderDate, today) <= 1;
          case '7d':
            return getDaysDifference(order.orderDate, today) <= 7;
          case '15d':
            return getDaysDifference(order.orderDate, today) <= 15;
          case '30d':
            return getDaysDifference(order.orderDate, today) <= 30;
          default:
            return true;
        }
      });

      // Apply status filter
      if (filterStatus === 'All') {
        return filteredOrders.sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
      }
      return filteredOrders.filter(order => order.status === filterStatus)
        .sort((a, b) => new Date(b.orderDate) - new Date(a.orderDate));
    },
    enabled: !!user?.email,
  });

  const updateOrderStatusMutation = useMutation({
    mutationFn: async ({ orderId, status }) => {
      const { data } = await axiosSecure.put(`/order/status/${orderId}`, { status });
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['sellerOrders', user?.email, filterStatus, timeFilter]);
      toast.success('Order status updated successfully!');
    },
    onError: (error) => {
      toast.error(error.response?.data?.message || 'Failed to update order status.');
    },
  });

  const handleStatusChange = (orderId, newStatus) => {
    updateOrderStatusMutation.mutate({ orderId, status: newStatus });
  };

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

  const orderStatusCount = orders.reduce((acc, order) => {
    acc[order.status] = (acc[order.status] || 0) + 1;
    return acc;
  }, {});

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center p-8 bg-gray-50">
        <Skeleton height={600} width="100%" className="max-w-5xl rounded-lg" />
      </div>
    );
  }
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 bg-gray-50">
        Error: {error.message}
      </div>
    );
  }
  if (orders.length === 0) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-xl min-h-[250px] flex items-center justify-center border border-gray-200">
        <p className="text-gray-700 text-xl font-semibold">No orders found for your products.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-gray-50 rounded-xl shadow-2xl min-h-screen"
    >
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-4 border-teal-600 pb-4">Order Management Dashboard</h1>

      {/* Total Orders Count */}
      <div className="flex flex-wrap gap-6 mb-8">
        <div className="bg-gradient-to-r from-yellow-200 to-yellow-400 p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 flex gap-2 items-center">
          <span className="text-lg font-medium text-gray-800">Pending</span>
          <span className="text-2xl font-bold text-yellow-800">{orderStatusCount.pending || 0}</span>
        </div>
        <div className="bg-gradient-to-r from-blue-200 to-blue-400 p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 flex gap-2 items-center">
          <span className="text-lg font-medium text-gray-800">Processing</span>
          <span className="text-2xl font-bold text-blue-800">{orderStatusCount.processing || 0}</span>
        </div>
        <div className="bg-gradient-to-r from-indigo-200 to-indigo-400 p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 flex gap-2 items-center">
          <span className="text-lg font-medium text-gray-800">Shipped</span>
          <span className="text-2xl font-bold text-indigo-800">{orderStatusCount.shipped || 0}</span>
        </div>
        <div className="bg-gradient-to-r from-green-200 to-green-400 p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 flex gap-2 items-center">
          <span className="text-lg font-medium text-gray-800">Delivered</span>
          <span className="text-2xl font-bold text-green-800">{orderStatusCount.delivered || 0}</span>
        </div>
        <div className="bg-gradient-to-r from-red-200 to-red-400 p-4 rounded-lg shadow-md border border-gray-200 hover:shadow-lg transition-all duration-300 flex gap-2 items-center">
          <span className="text-lg font-medium text-gray-800">Cancelled</span>
          <span className="text-2xl font-bold text-red-800">{orderStatusCount.cancelled || 0}</span>
        </div>
      </div>

      {/* Filter Options */}
      <div className="mb-8 flex flex-wrap gap-6 items-center justify-between">
        <div className="form-control w-full md:w-64">
          <label className="label text-base font-medium text-gray-700">
            <span>Filter by Status:</span>
          </label>
          <select
            className="select select-bordered w-full bg-white border-gray-300 focus:border-teal-600 focus:ring-teal-600 text-gray-900 rounded-md"
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
        <div className="form-control w-full md:w-64">
          <label className="label text-base font-medium text-gray-700">
            <span>Filter by Time:</span>
          </label>
          <select
            className="select select-bordered w-full bg-white border-gray-300 focus:border-teal-600 focus:ring-teal-600 text-gray-900 rounded-md"
            value={timeFilter}
            onChange={(e) => setTimeFilter(e.target.value)}
          >
            <option value="All">All Time</option>
            <option value="24h">Last 24 Hours</option>
            <option value="7d">Last 7 Days</option>
            <option value="15d">Last 15 Days</option>
            <option value="30d">Last 30 Days</option>
          </select>
        </div>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full bg-white border border-gray-200 rounded-xl">
          <thead>
            <tr className="bg-teal-700 text-white uppercase text-sm leading-tight">
              <th className="py-3 px-6 text-left">#</th>
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
              {orders.map((order, index) => (
                <motion.tr
                  key={order._id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: 20 }}
                  transition={{ duration: 0.3 }}
                  className="hover:bg-gray-50 border-b border-gray-100"
                >
                  <td className="py-4 px-6 text-sm text-gray-800">{index + 1}</td>
                  <td className="py-4 px-6 text-sm font-medium text-gray-800">{order._id.substring(0, 8)}...</td>
                  <td className="py-4 px-6 text-sm text-gray-700">{order.customerInfo?.name}</td>
                  <td className="py-4 px-6 text-sm text-gray-700">{new Date(order.orderDate).toLocaleDateString()}</td>
                  <td className="py-4 px-6 text-right text-sm font-semibold text-gray-900">৳{parseNumber(order.totalAmount).toFixed(2)}</td>
                  <td className="py-4 px-6 text-center">
                    <div className="flex items-center justify-center space-x-2 capitalize text-sm font-medium">
                      {getStatusIcon(order.status)}
                      <span className="text-gray-800">{order.status}</span>
                    </div>
                    {updateOrderStatusMutation.isPending && updateOrderStatusMutation.variables?.orderId === order._id ? (
                      <span className="loading loading-spinner loading-xs ml-2 text-teal-600"></span>
                    ) : (
                      <select
                        className="select select-ghost select-sm ml-2 w-32 bg-white border-gray-300 focus:border-teal-600 focus:ring-teal-600 text-gray-700 rounded-md"
                        value={order.status}
                        onChange={(e) => handleStatusChange(order._id, e.target.value)}
                        disabled={updateOrderStatusMutation.isLoading}
                      >
                        <option value="pending">Pending</option>
                        <option value="processing">Processing</option>
                        <option value="shipped">Shipped</option>
                        <option value="delivered">Delivered</option>
                        <option value="cancelled">Cancelled</option>
                      </select>
                    )}
                  </td>
                  <td className="py-4 px-6 text-center">
                    <button
                      className="btn btn-ghost btn-sm text-teal-600 hover:text-teal-800 hover:bg-teal-100 rounded-full transition-colors duration-200"
                      onClick={() => handleViewDetails(order)}
                    >
                      <FaEye className="mr-1" /> View Details
                    </button>
                  </td>
                </motion.tr>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>

      <AnimatePresence>
        {showOrderDetailsModal && selectedOrder && (
          <OrderDetailsModal
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

export default SellerOrders;