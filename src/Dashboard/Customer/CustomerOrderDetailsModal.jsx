import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { FaTimes, FaShippingFast, FaRulerCombined, FaBoxOpen, FaDollarSign, FaCreditCard } from 'react-icons/fa';

const CustomerOrderDetailsModal = ({ order, onClose, parseNumber, BASE64_FALLBACK_IMAGE }) => {
  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <motion.div
      initial="hidden"
      animate="visible"
      exit="exit"
      variants={modalVariants}
      className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4"
      onClick={onClose}
    >
      <motion.div
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

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Left Side: Order & Payment Info */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Payment & Shipping Info:</h3>
            <div className="space-y-2 text-gray-600">
              <p><strong>Subtotal:</strong> ৳{parseNumber(order.subtotal).toFixed(2)}</p>
              <p><strong>Shipping:</strong> {order.shippingMethod} (৳{parseNumber(order.shippingCost).toFixed(2)})</p>
              <p className="font-bold text-lg text-gray-800"><strong>Total:</strong> ৳{parseNumber(order.totalAmount).toFixed(2)}</p>
              <p className="flex items-center"><FaCreditCard className="mr-2" /> <strong>Payment Method:</strong> {order.paymentMethod === 'cashOnDelivery' ? 'ক্যাশ অন ডেলিভারি' : 'মোবাইল ব্যাংকিং / ব্যাংক'}</p>
              <p><FaBoxOpen className="mr-2" /> <strong>Status:</strong> <span className="capitalize">{order.status}</span></p>
              <p className="flex items-center"><FaDollarSign className="mr-2" /> <strong>Order Date:</strong> {new Date(order.orderDate).toLocaleDateString()}</p>
            </div>
            {order.manualPayment && (
              <div className="mt-4 p-3 border rounded-lg bg-gray-50">
                <h4 className="font-semibold text-gray-800 mb-1">Manual Payment Details:</h4>
                <p className="text-gray-600"><strong>Transaction ID:</strong> {order.manualPayment.transactionId}</p>
                {order.manualPayment.paymentScreenshot?.url && (
                  <img src={order.manualPayment.paymentScreenshot.url} alt="Payment Screenshot" className="w-32 h-32 object-cover rounded-md mt-2" />
                )}
              </div>
            )}
          </div>
          
          {/* Right Side: Customer Info */}
          <div>
            <h3 className="text-xl font-semibold text-gray-700 mb-2">Customer Information:</h3>
            <div className="space-y-2 text-gray-600">
              <p><strong>Name:</strong> {order.customerInfo?.name}</p>
              <p><strong>Phone:</strong> {order.customerInfo?.phoneNumber}</p>
              <p><strong>Email:</strong> {order.customerInfo?.userEmail}</p>
              <p><strong>Address:</strong> {order.customerInfo?.address}</p>
              {order.customerInfo?.orderNotes && <p><strong>Notes:</strong> {order.customerInfo.orderNotes}</p>}
            </div>
          </div>
        </div>

        {/* Order Items */}
        <div className="mt-6 border-t pt-4">
          <h3 className="text-xl font-semibold text-gray-700 mb-2">Ordered Products:</h3>
          <div className="space-y-4">
            {order.orderItems?.map((item, idx) => (
              <div key={idx} className="flex items-center space-x-4 border-b pb-2 last:border-b-0 last:pb-0">
                <img src={item.productImage || BASE64_FALLBACK_IMAGE} alt={item.productName} className="w-16 h-16 object-cover rounded" />
                <div className="flex-grow">
                  <p className="font-semibold text-gray-800">{item.productName} {item.variant?.color ? `(${item.variant.color})` : ''}</p>
                  <p className="text-sm text-gray-600">Quantity: {item.quantity} x ৳{parseNumber(item.price).toFixed(2)}</p>
                </div>
                <span className="font-bold text-gray-800 ml-auto">৳{(parseNumber(item.price) * item.quantity).toFixed(2)}</span>
              </div>
            ))}
          </div>
        </div>
        
        <div className="text-right mt-6">
          <button onClick={onClose} className="btn btn-primary">Close</button>
        </div>
      </motion.div>
    </motion.div>
  );
};

export default CustomerOrderDetailsModal;