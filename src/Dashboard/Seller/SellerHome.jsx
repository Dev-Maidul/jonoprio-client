import React, { useContext } from 'react';
import { AuthContext } from '../../Context/AuthProvider';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

const colors = ['#4A90E2', '#50C878', '#FFC107', '#FF6347', '#C0392B', '#FF69B4'];

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

const SellerHome = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();

  const { data: dashboardData, isLoading, isError, error } = useQuery({
    queryKey: ['sellerDashboardSummary', user?.email],
    queryFn: async () => {
      if (!user?.email) return null;
      const { data } = await axiosSecure.get(`/seller/dashboard-summary/${user.email}`);
      return data;
    },
    enabled: !!user?.email,
  });

  if (isLoading) {
    return (
      <div className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-lg">
        <Skeleton height={50} width="70%" className="mb-6" />
        <Skeleton height={24} width="50%" className="mb-10" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          <Skeleton height={150} count={5} />
        </div>
        <div className="mt-10">
          <Skeleton height={350} />
        </div>
      </div>
    );
  }

  if (isError) {
    return (
      <div className="text-red-600 text-center p-8 bg-white rounded-xl shadow-lg">
        Error: {error.message}
      </div>
    );
  }

  const { totalProducts, pendingOrders, totalSales, canceledOrders, deliveredOrders, avgOrderValue, salesData } = dashboardData;

  const formattedSalesData = salesData.map((item, index) => ({
    ...item,
    name: format(subDays(new Date(), 6 - index), 'MMM dd'),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-2xl"
    >
      <h1 className="text-4xl font-extrabold text-gray-900 mb-6 border-b-4 border-teal-600 pb-4">Welcome, {user?.displayName || 'Seller'}! 👋</h1>
      <p className="text-gray-700 text-lg mb-8">This is your Seller Dashboard. Manage your products and orders here.</p>
      
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-purple-100 p-6 rounded-xl shadow-md border-l-4 border-purple-600 hover:shadow-xl transition-shadow duration-300"
        >
          <h3 className="text-xl font-semibold text-purple-800 mb-3">Total Products</h3> 
          <p className="text-4xl font-extrabold text-purple-900">{totalProducts}</p>
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-orange-100 p-6 rounded-xl shadow-md border-l-4 border-orange-600 hover:shadow-xl transition-shadow duration-300"
        >
          <h3 className="text-xl font-semibold text-orange-800 mb-3">Pending Orders</h3> 
          <p className="text-4xl font-extrabold text-orange-900">{pendingOrders}</p>
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-teal-100 p-6 rounded-xl shadow-md border-l-4 border-teal-600 hover:shadow-xl transition-shadow duration-300"
        >
          <h3 className="text-xl font-semibold text-teal-800 mb-3">Total Sales</h3> 
          <p className="text-4xl font-extrabold text-teal-900">৳ {totalSales?.toFixed(2)}</p>
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 0.8, duration: 0.5 }}
          className="bg-red-100 p-6 rounded-xl shadow-md border-l-4 border-red-600 hover:shadow-xl transition-shadow duration-300"
        >
          <h3 className="text-xl font-semibold text-red-800 mb-3">Canceled Orders</h3> 
          <p className="text-4xl font-extrabold text-red-900">{canceledOrders}</p>
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 1.0, duration: 0.5 }}
          className="bg-green-100 p-6 rounded-xl shadow-md border-l-4 border-green-600 hover:shadow-xl transition-shadow duration-300"
        >
          <h3 className="text-xl font-semibold text-green-800 mb-3">Delivered Orders</h3> 
          <p className="text-4xl font-extrabold text-green-900">{deliveredOrders}</p>
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 1.2, duration: 0.5 }}
          className="bg-blue-100 p-6 rounded-xl shadow-md border-l-4 border-blue-600 hover:shadow-xl transition-shadow duration-300"
        >
          <h3 className="text-xl font-semibold text-blue-800 mb-3">Avg Order Value</h3> 
          <p className="text-4xl font-extrabold text-blue-900">৳ {avgOrderValue?.toFixed(2)}</p>
        </motion.div>
      </div>
      
      <div className="mt-10 p-6 bg-white rounded-xl shadow-lg border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-900 mb-6 border-b-2 border-teal-600 pb-2">Sales Summary (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={formattedSalesData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e5e7eb" />
            <XAxis dataKey="name" tick={{ fontSize: 14, fill: '#4B5563' }} />
            <YAxis tick={{ fontSize: 14, fill: '#4B5563' }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#f9fafb',
                border: '1px solid #e5e7eb',
                borderRadius: '10px',
                boxShadow: '0 4px 6px rgba(0,0,0,0.1)',
              }}
              itemStyle={{ color: '#1F2937' }}
            />
            <Legend verticalAlign="top" height={40} wrapperStyle={{ color: '#1F2937', fontSize: 14 }} />
            <Bar dataKey="sales" shape={<TriangleBar />} label={{ position: 'top', fill: '#1F2937', fontSize: 12 }}>
              {formattedSalesData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={colors[index % colors.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
      </div>
    </motion.div>
  );
};

export default SellerHome;