import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { AuthContext } from '../../Context/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery } from '@tanstack/react-query';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { FaShoppingCart, FaHeart, FaClipboardList } from 'react-icons/fa';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format } from 'date-fns';

// Color Palette for Bars
const colors = ['#0088FE', '#FFBB28']; // Blue for orders, Yellow for spent

// Custom Bar Shape using Triangle
const getPath = (x, y, width, height) => {
  return `M${x},${y + height}C${x + width / 3},${y + height} ${x + width / 2},${y + height / 3}
  ${x + width / 2}, ${y}
  C${x + width / 2},${y + height / 3} ${x + (2 * width) / 3},${y + height} ${x + width}, ${y + height}
  Z`;
};

const TriangleBar = (props) => {
  const { fill, x, y, width, height } = props;
  return <path d={getPath(x, y, width, height)} stroke="none" fill={fill} />;
};

const CustomerHome = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  // Fetch dynamic data for the customer dashboard
  const { data: dashboardData, isLoading, isError, error } = useQuery({
    queryKey: ['customerDashboardSummary', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const { data } = await axiosSecure.get(`/customer/dashboard-summary/${user.email}`);
      return data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return (
      <div className="p-6">
        <Skeleton height={40} width="60%" className="mb-4" />
        <Skeleton height={20} width="40%" className="mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton height={120} />
          <Skeleton height={120} />
          <Skeleton height={120} />
        </div>
        <div className="mt-8">
          <Skeleton height={300} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-500 text-center p-6">
        Error: {error.message}
      </div>
    );
  }

  const { totalOrders, wishlistItemsCount, lastOrder, totalSpent } = dashboardData;

  // Data to display in the chart (Total Orders and Total Spent)
  const chartData = [
    { name: 'মোট অর্ডার', value: totalOrders, color: colors[0] },
    { name: 'মোট খরচ', value: totalSpent, color: colors[1] },
  ];

  const CustomTooltip = ({ active, payload, label }) => {
    if (active && payload && payload.length) {
      return (
        <div className="p-4 bg-white border border-gray-200 rounded-md shadow-md">
          <p className="font-bold text-gray-800">{`${label}`}</p>
          <p className="text-sm text-gray-600">{`পরিমাণ: ৳ ${payload[0].value.toFixed(2)}`}</p>
        </div>
      );
    }
    return null;
  };

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
        {/* Total Orders Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-200 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-blue-700 mb-2 flex items-center gap-2">
            <FaClipboardList /> মোট অর্ডার
          </h3>
          <p className="text-4xl font-extrabold text-blue-900">{totalOrders}</p>
        </motion.div>

        {/* Items in Wishlist Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-pink-50 p-6 rounded-lg shadow-sm border border-pink-200 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-pink-700 mb-2 flex items-center gap-2">
            <FaHeart /> পছন্দের তালিকায়
          </h3>
          <p className="text-4xl font-extrabold text-pink-900">{wishlistItemsCount}</p>
        </motion.div>

        {/* Last Order Status Card */}
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-indigo-50 p-6 rounded-lg shadow-sm border border-indigo-200 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-indigo-700 mb-2 flex items-center gap-2">
            <FaClipboardList /> শেষ অর্ডারের অবস্থা
          </h3>
          {lastOrder ? (
            <>
              <p className="text-2xl font-bold text-indigo-900 capitalize mt-2">{lastOrder.status}</p>
              <p className="text-sm text-gray-500">on {format(new Date(lastOrder.orderDate), 'MMM dd, yyyy')}</p>
            </>
          ) : (
            <p className="text-lg font-medium text-gray-500 mt-2">কোনো সাম্প্রতিক অর্ডার নেই</p>
          )}
        </motion.div>
      </div>

      {/* Order Summary Chart */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">অর্ডার সারসংক্ষেপ</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={chartData}
            margin={{
              top: 20,
              right: 30,
              left: 20,
              bottom: 5,
            }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            <Bar dataKey="value" barSize={60} shape={<TriangleBar />}>
              {chartData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={entry.color} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default CustomerHome;
