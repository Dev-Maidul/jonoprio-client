import React, { useContext } from 'react';
import { AuthContext } from '../../Context/AuthProvider';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';
import { BarChart, Bar, Cell, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import { format, subDays } from 'date-fns';

const colors = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', '#FF0000', '#FF69B4'];

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

  // Fetch dynamic data for the seller dashboard
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
      <div className="p-6">
        <Skeleton height={40} width="60%" className="mb-4" />
        <Skeleton height={20} width="40%" className="mb-8" />
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <Skeleton height={120} count={5} />
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

  const { totalProducts, pendingOrders, totalSales, canceledOrders, deliveredOrders, avgOrderValue, salesData } = dashboardData;

  // Format sales data for chart with proper dates
  const formattedSalesData = salesData.map((item, index) => ({
    ...item,
    name: format(subDays(new Date(), 6 - index), 'MMM dd'),
  }));

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white rounded-lg shadow-md"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-4">Welcome, {user?.displayName || 'Seller'}! 👋</h1>
      <p className="text-gray-600">This is your Seller Dashboard. Manage your products and orders here.</p>
      
      {/* Dynamic Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 mt-8">
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 0.2, duration: 0.5 }}
          className="bg-purple-50 p-6 rounded-lg shadow-sm border border-purple-200 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-purple-700 mb-2">Total Products</h3> 
          <p className="text-4xl font-extrabold text-purple-900">{totalProducts}</p>
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 0.4, duration: 0.5 }}
          className="bg-orange-50 p-6 rounded-lg shadow-sm border border-orange-200 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-orange-700 mb-2">Pending Orders</h3> 
          <p className="text-4xl font-extrabold text-orange-900">{pendingOrders}</p>
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 0.6, duration: 0.5 }}
          className="bg-teal-50 p-6 rounded-lg shadow-sm border border-teal-200 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-teal-700 mb-2">Total Sales</h3> 
          <p className="text-4xl font-extrabold text-teal-900">৳ {totalSales?.toFixed(2)}</p>
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 0.8, duration: 0.5 }}
          className="bg-red-50 p-6 rounded-lg shadow-sm border border-red-200 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-red-700 mb-2">Canceled Orders</h3> 
          <p className="text-4xl font-extrabold text-red-900">{canceledOrders}</p>
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 1.0, duration: 0.5 }}
          className="bg-green-50 p-6 rounded-lg shadow-sm border border-green-200 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-green-700 mb-2">Delivered Orders</h3> 
          <p className="text-4xl font-extrabold text-green-900">{deliveredOrders}</p>
        </motion.div>
        
        <motion.div 
          initial={{ scale: 0.9, opacity: 0 }} 
          animate={{ scale: 1, opacity: 1 }} 
          transition={{ delay: 1.2, duration: 0.5 }}
          className="bg-blue-50 p-6 rounded-lg shadow-sm border border-blue-200 hover:shadow-lg transition-shadow"
        >
          <h3 className="text-xl font-semibold text-blue-700 mb-2">Avg Order Value</h3> 
          <p className="text-4xl font-extrabold text-blue-900">৳ {avgOrderValue?.toFixed(2)}</p>
        </motion.div>
      </div>
      
      {/* Sales Chart */}
      <div className="mt-8 p-6 bg-white rounded-lg shadow-md border border-gray-200">
        <h3 className="text-2xl font-bold text-gray-800 mb-4">Sales Summary (Last 7 Days)</h3>
        <ResponsiveContainer width="100%" height={400}>
          <BarChart
            data={formattedSalesData}
            margin={{ top: 20, right: 30, left: 20, bottom: 10 }}
          >
            <CartesianGrid strokeDasharray="3 3" stroke="#e0e0e0" />
            <XAxis dataKey="name" tick={{ fontSize: 12 }} />
            <YAxis tick={{ fontSize: 12 }} />
            <Tooltip
              contentStyle={{
                backgroundColor: '#fff',
                border: '1px solid #ccc',
                borderRadius: '8px',
                boxShadow: '0 2px 4px rgba(0,0,0,0.1)',
              }}
            />
            <Legend verticalAlign="top" height={36} />
            <Bar dataKey="sales" shape={<TriangleBar />} label={{ position: 'top' }}>
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