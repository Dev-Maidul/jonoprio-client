import React, { useState, useEffect } from "react";
import { FaEye, FaCheck, FaTimes, FaSpinner, FaDownload } from "react-icons/fa";
import useAxiosSecure from "../../hooks/useAxiosSecure";
import { useNavigate } from "react-router-dom";

const ManageOrders = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(false);
  const [selectedOrder, setSelectedOrder] = useState(null);
  const [statusFilter, setStatusFilter] = useState("");
  const [showLast24Hours, setShowLast24Hours] = useState(false);
  const axiosSecure = useAxiosSecure(); // Custom hook to handle secure axios requests
  const navigate = useNavigate(); // useNavigate for redirection

  useEffect(() => {
    setLoading(true);
    axiosSecure
      .get("/admin/orders")
      .then((response) => {
        setOrders(response.data);
      })
      .catch((error) => {
        console.error("Error fetching orders", error);
      })
      .finally(() => {
        setLoading(false);
      });
  }, [axiosSecure]);

  // Filter orders based on Last 24 Hours and status
  const filteredOrders = orders.filter((order) => {
    const orderDate = new Date(order.orderDate);
    const last24Hours = new Date().getTime() - 24 * 60 * 60 * 1000;

    if (showLast24Hours) {
      return orderDate.getTime() >= last24Hours;
    }

    return statusFilter ? order.status === statusFilter : true;
  });

  const handleOrderStatusUpdate = (orderId, status) => {
    axiosSecure
      .put(`/order/status/${orderId}`, { status })
      .then(() => {
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: status } : order
          )
        );
      })
      .catch((error) => {
        console.error("Error updating order status", error);
      });
  };

  const handleOrderCancel = (orderId) => {
    axiosSecure
      .put(`/order/cancel/${orderId}`)
      .then(() => {
        setOrders(
          orders.map((order) =>
            order._id === orderId ? { ...order, status: "canceled" } : order
          )
        );
      })
      .catch((error) => {
        console.error("Error canceling order", error);
      });
  };

  const handleViewOrderDetails = (orderId) => {
    navigate(`/dashboard/order/${orderId}`);

  };

  const handleStatusFilterChange = (e) => {
    setStatusFilter(e.target.value);
  };

  const handleLast24HoursToggle = () => {
    setShowLast24Hours((prev) => !prev);
  };

  // Download order history as CSV
  const downloadCSV = () => {
    const header = [
      "Order ID",
      "Customer Name",
      "Total Amount",
      "Order Time",
      "Status",
      "Payment Method",
    ];
    const rows = filteredOrders.map((order) => [
      order._id,
      order.customerInfo.name,
      order.totalAmount,
      new Date(order.orderDate).toLocaleString(),
      order.status,
      order.paymentMethod,
    ]);

    const csvContent = [
      header.join(","),
      ...rows.map((row) => row.join(",")),
    ].join("\n");

    const blob = new Blob([csvContent], { type: "text/csv" });
    const link = document.createElement("a");
    link.href = URL.createObjectURL(blob);
    link.download = "order_history.csv";
    link.click();
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Orders</h2>

      {/* Filter Orders by Status */}
      <div className="mb-6">
        <label className="text-lg font-semibold">Filter by Status:</label>
        <select
          value={statusFilter}
          onChange={handleStatusFilterChange}
          className="ml-2 p-2 border rounded"
        >
          <option value="">All Orders</option>
          <option value="pending">Pending</option>
          <option value="shipped">Shipped</option>
          <option value="delivered">Delivered</option>
          <option value="canceled">Canceled</option>
        </select>
      </div>

      {/* Filter Orders for Last 24 Hours */}
      <div className="mb-6">
        <label className="text-lg font-semibold">Show Last 24 Hours Orders:</label>
        <input
          type="checkbox"
          checked={showLast24Hours}
          onChange={handleLast24HoursToggle}
          className="ml-2"
        />
      </div>

      {/* Download Order History Button */}
      <button
        onClick={downloadCSV}
        className="mb-6 bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 flex items-center gap-2"
      >
        <FaDownload /> Download Order History
      </button>

      {/* Order Table */}
      {loading ? (
        <div className="flex justify-center items-center space-x-2">
          <FaSpinner className="animate-spin text-2xl" />
          <span>Loading Orders...</span>
        </div>
      ) : (
        <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
          <thead className="bg-gray-100">
            <tr>
              <th className="px-4 py-2 text-left">S.No</th>
              <th className="px-4 py-2 text-left">Order ID</th>
              <th className="px-4 py-2 text-left">Customer</th>
              <th className="px-4 py-2 text-left">Total</th>
              <th className="px-4 py-2 text-left">Order Time</th>
              <th className="px-4 py-2 text-left">Status</th>
              <th className="px-4 py-2 text-left">Actions</th>
            </tr>
          </thead>
          <tbody>
            {filteredOrders.map((order, index) => (
              <tr key={order._id} className="border-t">
                <td className="px-4 py-2">{index + 1}</td>
                <td className="px-4 py-2">{order._id}</td>
                <td className="px-4 py-2">{order.customerInfo.name}</td>
                <td className="px-4 py-2">৳{order.totalAmount}</td>
                <td className="px-4 py-2">
                  {new Date(order.orderDate).toLocaleString()}
                </td>
                <td className="px-4 py-2">{order.status}</td>
                <td className="px-4 py-2 flex gap-3">
                  <button
                    className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer flex items-center gap-1"
                    onClick={() => handleViewOrderDetails(order._id)}
                  >
                    <FaEye /> View
                  </button>
                  {order.status !== "delivered" && (
                    <>
                      <button
                        className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 cursor-pointer flex items-center gap-1"
                        onClick={() => handleOrderStatusUpdate(order._id, "shipped")}
                      >
                        <FaCheck /> Ship
                      </button>
                      <button
                        className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 cursor-pointer flex items-center gap-1"
                        onClick={() => handleOrderStatusUpdate(order._id, "delivered")}
                      >
                        <FaCheck /> Deliver
                      </button>
                    </>
                  )}
                  {order.status !== "canceled" && (
                    <button
                      className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 cursor-pointer flex items-center gap-1"
                      onClick={() => handleOrderCancel(order._id)}
                    >
                      <FaTimes /> Cancel
                    </button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}
    </div>
  );
};

export default ManageOrders;
