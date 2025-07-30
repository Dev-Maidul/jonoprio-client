import React from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const OrderDetailsModal = ({ order, onClose }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      exit={{ opacity: 0 }}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
        initial={{ scale: 0.9, y: 20 }}
        animate={{ scale: 1, y: 0 }}
        exit={{ scale: 0.9, y: 20 }}
        transition={{ duration: 0.3 }}
        className="bg-white rounded-lg shadow-xl p-6 w-full max-w-2xl relative overflow-y-auto max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        <button
          onClick={onClose}
          className="absolute top-3 right-3 text-gray-500 hover:text-gray-800 text-2xl"
          aria-label="Close"
        >
          <FaTimes />
        </button>
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Order Details (ID: {order._id.substring(0,8)}...)</h2>

        {/* Customer Info */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Customer Information:</h3>
          <p className="text-gray-600"><strong>Name:</strong> {order.customerInfo?.name}</p>
          <p className="text-gray-600"><strong>Phone:</strong> {order.customerInfo?.phoneNumber}</p>
          <p className="text-gray-600"><strong>Email:</strong> {order.customerInfo?.userEmail}</p>
          <p className="text-gray-600"><strong>Address:</strong> {order.customerInfo?.address}</p>
          {order.customerInfo?.orderNotes && <p className="text-gray-600"><strong>Notes:</strong> {order.customerInfo.orderNotes}</p>}
        </div>

        {/* Order Items */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Ordered Products:</h3>
          <div className="space-y-4">
            {order.orderItems?.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-4 border-b pb-2 last:border-b-0 last:pb-0">
                <img src={item.productImage || "fallback-image"} alt={item.productName} className="w-16 h-16 object-cover rounded" />
                <div>
                  <p className="font-semibold text-gray-800">{item.productName} {item.variant?.color ? `(${item.variant.color})` : ''}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity} x ৳{item.price}</p>
                </div>
                <span className="font-bold text-gray-800 ml-auto">৳{item.price * item.quantity}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment & Shipping Summary */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Payment & Shipping Summary:</h3>
          <p className="text-gray-600"><strong>Subtotal:</strong> ৳{order.subtotal}</p>
          <p className="text-gray-600"><strong>Shipping:</strong> {order.shippingMethod} (৳{order.shippingCost})</p>
          <p className="text-gray-600"><strong>Total:</strong> ৳{order.totalAmount}</p>
          <p className="text-gray-600"><strong>Payment Method:</strong> {order.paymentMethod}</p>
          <p className="text-gray-600"><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
          <p className="text-gray-600"><strong>Status:</strong> <span className="capitalize">{order.status}</span></p>
        </div>

        <div className="text-right">
          <button onClick={onClose} className="btn btn-outline">Close</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default OrderDetailsModal;
