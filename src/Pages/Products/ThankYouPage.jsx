import React, { useEffect, useState } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { FaCheckCircle } from 'react-icons/fa';

import logo from '../../assets/Logo1.png'
import CustomButton from '../../components/CustomButton';

const ThankYouPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const [orderId, setOrderId] = useState(null);
  const [orderDetails, setOrderDetails] = useState(null);
  const [displayDate, setDisplayDate] = useState(null); // তারিখ রাখার জন্য নতুন স্টেট

  useEffect(() => {
    // Check if orderId and orderDetails are passed via location state
    if (location.state && location.state.orderId) {
      setOrderId(location.state.orderId);
      setOrderDetails(location.state.orderDetails);
      // FIXED: Directly use location.state.orderDate for parsing
      if (location.state.orderDate) {
        setDisplayDate(new Date(location.state.orderDate).toLocaleDateString());
      } else {
        setDisplayDate(new Date().toLocaleDateString()); // Fallback to current date if not passed
      }
    } else {
      // If no orderId, redirect to home or all products after a short delay
      setTimeout(() => {
        navigate('/', { replace: true });
      }, 3000);
    }
  }, [location.state, navigate]);

  // Helper to safely parse MongoDB Extended JSON numbers
  const parseNumber = (value) => {
    if (typeof value === 'object' && value !== null && (value?.$numberInt !== undefined || value?.$numberDouble !== undefined)) {
      return parseFloat(value.$numberInt || value.$numberDouble);
    }
    return parseFloat(value) || 0;
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen bg-gradient-to-tr from-[#f0f4ff] to-[#ffe6f0] flex flex-col items-center justify-center p-4"
    >
      <motion.div
        initial={{ scale: 0.8, opacity: 0 }}
        animate={{ scale: 1, opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.2 }}
        className="bg-white rounded-lg shadow-xl p-6 md:p-8 max-w-2xl w-full"
      >
        {/* Logo and Thank You Header */}
        <div className="flex flex-col items-center mb-6">
          <img src={logo} alt="Jonoprio Logo" className="h-12 md:h-16 mb-4" />
          <FaCheckCircle className="text-green-500 text-6xl mx-auto mb-4" />
          <h1 className="text-3xl md:text-4xl font-bold text-gray-800 mb-2">
            ধন্যবাদ! আপনার অর্ডার সম্পন্ন হয়েছে।
          </h1>
          <p className="text-lg text-gray-700">
            কিছুক্ষণের মধ্যে আমাদের একজন প্রতিনিধি আপনার সাথে যোগাযোগ করবে।
          </p>
        </div>
        
        {/* Order Details Summary */}
        {orderId && orderDetails ? (
          <div className="border rounded-lg p-4 mb-6">
            <h2 className="text-xl font-bold text-gray-800 mb-3">আপনার অর্ডার সারসংক্ষেপ</h2>
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-3 text-left mb-4">
              <div>
                <span className="font-semibold text-gray-700">অর্ডার আইডি:</span> <span className="text-blue-600 font-medium">{orderId}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">তারিখ:</span> <span className="text-gray-700">{displayDate || 'তারিখ পাওয়া যায়নি'}</span> {/* FIXED: Use displayDate */}
              </div>
              <div>
                <span className="font-semibold text-gray-700">মোট পরিমাণ:</span> <span className="text-xl font-bold text-blue-600">৳{parseNumber(orderDetails.totalAmount).toFixed(2)}</span>
              </div>
              <div>
                <span className="font-semibold text-gray-700">পেমেন্ট পদ্ধতি:</span> <span className="text-gray-700">{orderDetails.paymentMethod === 'cashOnDelivery' ? 'ক্যাশ অন ডেলিভারি' : 'মোবাইল ব্যাংকিং / ব্যাংক'}</span>
              </div>
            </div>

            {/* Order Items */}
            <div className="border-t pt-4 mt-4">
              <h3 className="text-lg font-bold text-gray-800 mb-3">অর্ডারের পণ্যসমূহ:</h3>
              {orderDetails.orderItems?.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 mb-3 border-b pb-3 last:border-b-0 last:pb-0">
                  <img src={item.productImage || 'https://via.placeholder.com/50?text=No+Img'} alt={item.productName} className="w-16 h-16 object-cover rounded" />
                  <div>
                    <p className="font-semibold text-gray-800">{item.productName} {item.variant?.color ? `(${item.variant.color})` : ''}</p>
                    <p className="text-sm text-gray-600">পরিমাণ: {item.quantity} x ৳{parseNumber(item.price).toFixed(2)}</p>
                  </div>
                  <span className="font-bold text-gray-800 ml-auto">৳{(parseNumber(item.price) * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            {/* Customer & Shipping Info */}
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 border-t pt-4 mt-4">
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">বিলিং ঠিকানা:</h3>
                <p className="text-gray-700">{orderDetails.customerInfo.name}</p>
                <p className="text-gray-700">{orderDetails.customerInfo.phoneNumber}</p>
                <p className="text-gray-700">{orderDetails.customerInfo.address}</p>
                {orderDetails.customerInfo.userEmail && <p className="text-gray-700">{orderDetails.customerInfo.userEmail}</p>}
                {orderDetails.customerInfo.orderNotes && <p className="text-gray-700 text-sm italic">নোট: {orderDetails.customerInfo.orderNotes}</p>}
              </div>
              <div>
                <h3 className="text-lg font-bold text-gray-800 mb-2">শিপিং ঠিকানা:</h3>
                <p className="text-gray-700"> {orderDetails.customerInfo.address}</p>
                <p className="text-gray-700">পদ্ধতি: {orderDetails.shippingMethod} (৳{parseNumber(orderDetails.shippingCost).toFixed(2)})</p>
              </div>
            </div>

            {/* Manual Payment Details if applicable */}
            {orderDetails.manualPayment && orderDetails.paymentMethod === 'mobileBanking' && (
              <div className="border-t pt-4 mt-4">
                <h3 className="text-lg font-bold text-gray-800 mb-2">মোবাইল ব্যাংকিং পেমেন্টের তথ্য:</h3>
                <p className="text-gray-700">ট্রানজেকশন আইডি: <span className="font-bold">{orderDetails.manualPayment.transactionId}</span></p>
                {orderDetails.manualPayment.paymentScreenshot?.url && (
                  <div className="mt-2">
                    <p className="text-gray-700">স্ক্রিনশট:</p>
                    <img src={orderDetails.manualPayment.paymentScreenshot.url} alt="Payment Screenshot" className="w-32 h-32 object-cover rounded-md mt-1" />
                  </div>
                )}
                {orderDetails.manualPayment.mobileBankingType && <p className="text-gray-700">ধরণ: {orderDetails.manualPayment.mobileBankingType}</p>}
              </div>
            )}

          </div>
        ) : (
          <p className="text-md text-gray-500 mb-8">আপনার অর্ডার আইডি বা বিবরণ পাওয়া যায়নি।</p>
        )}

        {/* Back to Home Button */}
        <CustomButton
          to="/"
          text="হোমপেজে ফিরে যান"
          color="blue"
          className="w-full py-3 text-lg mt-6"
        />
      </motion.div>
    </motion.div>
  );
};

export default ThankYouPage;