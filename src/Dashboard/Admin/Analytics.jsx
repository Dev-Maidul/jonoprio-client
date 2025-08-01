
import React, { useEffect, useState } from 'react';
import { FaDownload } from 'react-icons/fa';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import {
  LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  BarChart, Bar, Cell,
} from 'recharts';

// Custom TriangleBar component
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

const COLORS = ['#0088FE', '#00C49F', '#FFBB28', '#FF8042', 'red', 'pink'];

const Analytics = () => {
  const [salesData, setSalesData] = useState(null);
  const [ordersData, setOrdersData] = useState(null);
  const [customersData, setCustomersData] = useState(null);
  const [loading, setLoading] = useState(true);
  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    const fetchData = async () => {
      try {
        const [salesResponse, ordersResponse, customersResponse] = await Promise.all([
          axiosSecure.get('/admin/analytics/sales'),
          axiosSecure.get('/admin/analytics/orders-status'),
          axiosSecure.get('/admin/analytics/customers'),
        ]);

        setSalesData(salesResponse.data);
        setOrdersData(ordersResponse.data);
        setCustomersData(customersResponse.data);
      } catch (error) {
        console.error('Error fetching analytics data:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [axiosSecure]);

  const handleExport = async () => {
    try {
      const response = await axiosSecure.get('/admin/analytics/export', { responseType: 'blob' });
      const url = window.URL.createObjectURL(new Blob([response.data], { type: 'text/csv' }));
      const link = document.createElement('a');
      link.href = url;
      link.setAttribute('download', 'analytics-report.csv');
      document.body.appendChild(link);
      link.click();
      document.body.removeChild(link);
      window.URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error exporting analytics data:', error);
      if (error.code === 'ERR_NETWORK') {
        alert('Network error occurred while exporting analytics. Please check your internet connection or try again later.');
      } else {
        alert('Failed to export analytics. Please check the console for details or contact support.');
      }
    }
  };

  if (loading) return <div className="p-6">Loading Analytics...</div>;

  const salesGraphData = [
    { name: 'Total Sales', value: salesData.totalSales },
    { name: 'Average Order Value', value: salesData.averageOrderValue },
  ];

  const ordersGraphData = [
    { name: 'Pending', value: ordersData.pending },
    { name: 'Shipped', value: ordersData.shipped },
    { name: 'Delivered', value: ordersData.delivered },
    { name: 'Canceled', value: ordersData.canceled },
  ];

  const customerGraphData = [
    { name: 'Total Customers', value: customersData.totalCustomers },
    { name: 'New Customers', value: customersData.newCustomers },
    { name: 'Returning Customers', value: customersData.returningCustomers },
  ];

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Analytics</h2>

      {/* Sales Overview */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Sales Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={salesGraphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Line type="monotone" dataKey="value" stroke="#8884d8" activeDot={{ r: 8 }} />
          </LineChart>
        </ResponsiveContainer>
        <p>Total Sales: ${salesData.totalSales}</p>
        <p>Average Order Value: ${salesData.averageOrderValue}</p>
      </div>

      {/* Orders Overview */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Orders Overview</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={ordersGraphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" shape={<TriangleBar />} label={{ position: 'top' }}>
              {ordersGraphData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p>Pending Orders: {ordersData.pending}</p>
        <p>Shipped Orders: {ordersData.shipped}</p>
        <p>Delivered Orders: {ordersData.delivered}</p>
        <p>Canceled Orders: {ordersData.canceled}</p>
      </div>

      {/* Customers Overview */}
      <div className="mb-6 p-4 bg-white rounded-lg shadow">
        <h3 className="text-lg font-semibold mb-2">Customer Insights</h3>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={customerGraphData}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="name" />
            <YAxis />
            <Tooltip />
            <Legend />
            <Bar dataKey="value" fill="#8884d8">
              {customerGraphData.map((entry, index) => (
                <Cell key={`cell-${index}`} fill={index === 0 ? '#ff6347' : '#8884d8'} />
              ))}
            </Bar>
          </BarChart>
        </ResponsiveContainer>
        <p>Total Customers: {customersData.totalCustomers}</p>
        <p>New Customers: {customersData.newCustomers}</p>
        <p>Returning Customers: {customersData.returningCustomers}</p>
      </div>

      {/* Export Button */}
      <button
        onClick={handleExport}
        className="mb-4 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2 cursor-pointer"
      >
        <FaDownload /> Export Analytics
      </button>
    </div>
  );
};

export default Analytics;
