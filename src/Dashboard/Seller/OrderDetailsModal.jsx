import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { FaTimes } from 'react-icons/fa';

const OrderDetailsModal = ({ order, onClose, BASE64_FALLBACK_IMAGE }) => {

  // State for controlling the zoomed-in image modal
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [selectedImage, setSelectedImage] = useState(null);

  // Helper function to parse MongoDB extended JSON to normal number
  const parseNumber = (value) => {
    if (value && typeof value === 'object') {
      // Check if it's a MongoDB extended type, like $numberInt or $numberDouble
      return parseFloat(value.$numberInt || value.$numberDouble);
    }
    return parseFloat(value) || 0;
  };

  // Function to handle the click on payment screenshot
  const handleImageClick = (url) => {
    setSelectedImage(url);
    setIsImageModalOpen(true);
  };

  // Function to close the image modal
  const closeImageModal = () => {
    setIsImageModalOpen(false);
    setSelectedImage(null);
  };

  // Convert orderDate to a readable time format (HH:mm:ss)
  const formatOrderTime = (timestamp) => {
    const date = new Date(timestamp);
    return date.toLocaleTimeString(); // Will show in HH:mm:ss format
  };

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
        <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Order Details (ID: {order._id.substring(0, 8)}...)</h2>

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
                <img src={item.productImage || BASE64_FALLBACK_IMAGE} alt={item.productName} className="w-16 h-16 object-cover rounded" />
                <div>
                  <p className="font-semibold text-gray-800">{item.productName} {item.variant?.color ? `(${item.variant.color})` : ''}</p>
                  <p className="text-sm text-gray-600">Quantity: {parseNumber(item.quantity)} x ৳{parseNumber(item.price).toFixed(2)}</p>
                </div>
                <span className="font-bold text-gray-800 ml-auto">৳{(parseNumber(item.price) * parseNumber(item.quantity)).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>

        {/* Payment & Shipping Summary */}
        <div className="mb-6">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Payment & Shipping Summary:</h3>
          <p className="text-gray-600"><strong>Subtotal:</strong> ৳{parseNumber(order.subtotal).toFixed(2)}</p>
          <p className="text-gray-600"><strong>Shipping:</strong> {order.shippingMethod} (৳{parseNumber(order.shippingCost).toFixed(2)})</p>
          <p className="text-gray-600"><strong>Total:</strong> ৳{parseNumber(order.totalAmount).toFixed(2)}</p>
          <p className="text-gray-600"><strong>Payment Method:</strong> {order.paymentMethod === 'cashOnDelivery' ? 'Cash on Delivery' : 'Mobile Banking / Bank'}</p>
          <p className="text-gray-600"><strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
          <p className="text-gray-600"><strong>Order Time:</strong> {formatOrderTime(order.orderDate)}</p> {/* Display order time */}
          <p className="text-gray-600"><strong>Status:</strong> <span className="capitalize">{order.status}</span></p>

          {/* Mobile Banking Payment Details */}
          {order.paymentMethod === 'mobileBanking' && (
            <div className="mt-4 p-3 border rounded-lg bg-gray-50">
              <h4 className="font-semibold text-gray-800 mb-1">Mobile Banking Payment Details:</h4>
              <p className="text-gray-600"><strong>Transaction ID:</strong> {order.manualPayment?.transactionId || "N/A"}</p>
              <p className="text-gray-600"><strong>Payment Amount:</strong> ৳{parseNumber(order.manualPayment?.paymentAmount || order.totalAmount).toFixed(2)}</p>
              {order.manualPayment?.paymentScreenshot?.url && (
                <div className="mt-2">
                  <p className="text-gray-600"><strong>Screenshot:</strong></p>
                  <img
                    src={order.manualPayment.paymentScreenshot.url}
                    alt="Payment Screenshot"
                    className="w-32 h-32 object-cover rounded-md cursor-pointer"
                    onClick={() => handleImageClick(order.manualPayment.paymentScreenshot.url)} // Handle image click
                  />
                </div>
              )}
            </div>
          )}
        </div>

        <div className="text-right">
          <button onClick={onClose} className="btn btn-outline">Close</button>
        </div>
      </motion.div>

      {/* Modal for Zoomed-In Image */}
      {isImageModalOpen && selectedImage && (
        <div className="fixed inset-0 bg-black bg-opacity-80 z-60 flex items-center justify-center">
          <div className="relative w-full max-w-4xl">
            <img
              src={selectedImage}
              alt="Payment Screenshot"
              className="w-full h-auto max-h-[90vh] object-contain cursor-zoom-out"
              onClick={closeImageModal} // Close zoom modal on image click
            />
            <button
              onClick={closeImageModal}
              className="absolute top-4 right-4 text-white text-3xl"
              aria-label="Close"
            >
              <FaTimes />
            </button>
          </div>
        </div>
      )}

    </motion.div>
  );
};

export default OrderDetailsModal;
