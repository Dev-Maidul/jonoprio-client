import React, { useEffect, useState } from 'react';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer,
  PieChart, Pie, Cell,
} from 'recharts';

const COLORS = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEEAD'];

const AdminHome = () => {
  const [dashboardData, setDashboardData] = useState(null);
  const [recentOrders, setRecentOrders] = useState([]);
  const [pendingOrders, setPendingOrders] = useState([]);
  const [products, setProducts] = useState([]);
  const [customers, setCustomers] = useState([]);
  const [securityAlerts, setSecurityAlerts] = useState([]);
  const [siteHealth, setSiteHealth] = useState({ uptime: 0, loadTime: '' });
  const [last30DaysData, setLast30DaysData] = useState({ totalOrders: 0, totalPrice: 0 });
  const [last7DaysData, setLast7DaysData] = useState({ totalOrders: 0, totalPrice: 0 });

  const axiosSecure = useAxiosSecure();

  useEffect(() => {
    axiosSecure.get('/admin/dashboard')
      .then((response) => setDashboardData(response.data))
      .catch((error) => console.error('Error fetching dashboard data:', error));

    axiosSecure.get('/admin/orders/recent')
      .then((response) => setRecentOrders(response.data))
      .catch((error) => console.error('Error fetching recent orders:', error));

    axiosSecure.get('/admin/orders/status?status=pending')
      .then((response) => setPendingOrders(response.data))
      .catch((error) => console.error('Error fetching pending orders:', error));

    axiosSecure.get('/admin/products')
      .then((response) => setProducts(response.data))
      .catch((error) => console.error('Error fetching products:', error));

    axiosSecure.get('/admin/customers/overview')
      .then((response) => setCustomers(response.data))
      .catch((error) => console.error('Error fetching customers overview:', error));

    axiosSecure.get('/admin/security/alerts')
      .then((response) => setSecurityAlerts(response.data))
      .catch((error) => console.error('Error fetching security alerts:', error));

    axiosSecure.get('/admin/health')
      .then((response) => setSiteHealth(response.data))
      .catch((error) => console.error('Error fetching site health:', error));

    axiosSecure.get('/admin/orders/last-30-days')
      .then((response) => setLast30DaysData(response.data))
      .catch((error) => console.error('Error fetching last 30 days data:', error));

    axiosSecure.get('/admin/orders/last-7-days')
      .then((response) => setLast7DaysData(response.data))
      .catch((error) => console.error('Error fetching last 7 days data:', error));
  }, [axiosSecure]);

  if (!dashboardData) {
    return <div className="p-6 text-center">Loading...</div>;
  }

  const ordersChartData = [
    { name: 'Pending', value: pendingOrders.length },
    { name: 'Recent', value: recentOrders.length },
  ];
  const productsChartData = products.map(p => ({ name: p.productName, value: p.price }));
  const customersChartData = [
    { name: 'New', value: customers.newCustomers },
    { name: 'Returning', value: customers.returningCustomers },
  ];

  return (
    <div className="p-4 md:p-6 lg:p-8 min-h-screen bg-gray-100">
      <h2 className="text-3xl font-bold mb-6 text-gray-800">Admin Dashboard</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4 mb-6">
        <div className="bg-gradient-to-r from-purple-400 to-pink-500 p-4 rounded-lg shadow-lg text-white cursor-pointer">
          <h3 className="text-lg font-semibold">Total Sales</h3>
          <p className="text-2xl">{dashboardData.totalSales.toLocaleString()} ৳</p>
        </div>
        <div className="bg-gradient-to-r from-blue-400 to-green-500 p-4 rounded-lg shadow-lg text-white cursor-pointer">
          <h3 className="text-lg font-semibold">Total Orders</h3>
          <p className="text-2xl">{dashboardData.totalOrders.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-r from-yellow-400 to-orange-500 p-4 rounded-lg shadow-lg text-white cursor-pointer">
          <h3 className="text-lg font-semibold">Total Products</h3>
          <p className="text-2xl">{dashboardData.totalProducts.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-r from-teal-400 to-cyan-500 p-4 rounded-lg shadow-lg text-white cursor-pointer">
          <h3 className="text-lg font-semibold">Total Customers</h3>
          <p className="text-2xl">{dashboardData.totalCustomers.toLocaleString()}</p>
        </div>
        <div className="bg-gradient-to-r from-indigo-400 to-purple-500 p-4 rounded-lg shadow-lg text-white cursor-pointer">
          <h3 className="text-lg font-semibold">Average Order Value</h3>
          <p className="text-2xl">{dashboardData.averageOrderValue.toLocaleString()} ৳</p>
        </div>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-2 gap-4 mb-6">
        <div className="bg-gradient-to-r from-green-400 to-teal-500 p-4 rounded-lg shadow-lg text-white cursor-pointer">
          <h3 className="text-lg font-semibold">Last 30 Days Orders</h3>
          <p className="text-2xl">{last30DaysData.totalOrders.toLocaleString()}</p>
          <p className="text-md">Total: {last30DaysData.totalPrice.toLocaleString()} ৳</p>
        </div>
        <div className="bg-gradient-to-r from-blue-400 to-indigo-500 p-4 rounded-lg shadow-lg text-white cursor-pointer">
          <h3 className="text-lg font-semibold">Last 7 Days Orders</h3>
          <p className="text-2xl">{last7DaysData.totalOrders.toLocaleString()}</p>
          <p className="text-md">Total: {last7DaysData.totalPrice.toLocaleString()} ৳</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Recent Orders</h3>
          {recentOrders.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Customer Email</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Product(s)</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Total</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {recentOrders.map(order => (
                    <tr key={order._id}>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{order.customerInfo?.userEmail ? order.customerInfo.userEmail : 'Not Found'}</td>
                      <td className="px-4 py-2 whitespace-normal text-sm text-gray-900">
                        {order.orderItems
                          ?.map(item => item.productName)
                          .join(', ') || 'Not Found'}
                      </td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{order.status || 'Not Found'}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{order.totalAmount ? order.totalAmount.toLocaleString() + ' ৳' : 'Not Found'}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center">No recent orders.</p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg cursor-pointer">
          <h3 className="text-xl font-semibold mb-4">Pending Orders</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={ordersChartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#8884d8">
                {ordersChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg cursor-pointer">
          <h3 className="text-xl font-semibold mb-4">Products</h3>
          <ResponsiveContainer width="100%" height={200}>
            <BarChart data={productsChartData.slice(0, 5)}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="name" angle={-45} textAnchor="end" height={60} />
              <YAxis />
              <Tooltip />
              <Legend />
              <Bar dataKey="value" fill="#82ca9d">
                {productsChartData.slice(0, 5).map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Bar>
            </BarChart>
          </ResponsiveContainer>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg cursor-pointer">
          <h3 className="text-xl font-semibold mb-4">Customer Overview</h3>
          <ResponsiveContainer width="100%" height={200}>
            <PieChart>
              <Pie
                data={customersChartData}
                cx="50%"
                cy="50%"
                outerRadius={80}
                fill="#8884d8"
                dataKey="value"
                label
              >
                {customersChartData.map((entry, index) => (
                  <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                ))}
              </Pie>
              <Tooltip />
              <Legend />
            </PieChart>
          </ResponsiveContainer>
          <p>Total Customers: {customers.totalCustomers.toLocaleString()}</p>
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Security Alerts</h3>
          {securityAlerts.length > 0 ? (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Alert</th>
                    <th scope="col" className="px-4 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Time</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {securityAlerts.map(alert => (
                    <tr key={alert.time}>
                      <td className="px-4 py-2 whitespace-normal text-sm text-gray-900">{alert.alert}</td>
                      <td className="px-4 py-2 whitespace-nowrap text-sm text-gray-900">{new Date(alert.time).toLocaleString()}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center">No security alerts.</p>
          )}
        </div>

        <div className="bg-white p-4 rounded-lg shadow-lg">
          <h3 className="text-xl font-semibold mb-4">Site Health</h3>
          <p>Uptime: {siteHealth.uptime} seconds</p>
          <p>Load Time: {siteHealth.loadTime}</p>
        </div>
      </div>
    </div>
  );
};

export default AdminHome;