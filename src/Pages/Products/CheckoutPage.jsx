import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { AuthContext } from '../../Context/AuthProvider';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaClipboardCheck, FaCreditCard, FaPlus, FaCamera } from 'react-icons/fa';
import CustomButton from '../../components/CustomButton';
import { imageUpload } from '../../API/utilis';

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);

  const BASE64_FALLBACK_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXRSTlMAQObYZgAAAFpJUVORK5CYII=';

  // Get cart items from location state
  const { cartItems = [], subtotal = 0, totalItems = 0 } = location.state || {};

  const { register, handleSubmit, formState: { errors }, watch, setValue } = useForm({
    defaultValues: {
      shippingMethod: 'ঢাকার ভেতরে',
      createAccount: false,
      paymentMethod: 'cashOnDelivery',
    }
  });

  const selectedShippingMethod = watch('shippingMethod');
  const selectedPaymentMethod = watch('paymentMethod');
  const showOrderNotes = watch('addOrderNotes');

  const [paymentScreenshotFile, setPaymentScreenshotFile] = useState(null);
  const [paymentScreenshotPreview, setPaymentScreenshotPreview] = useState(null);

  const SHIPPING_COSTS = {
    'ঢাকার ভেতরে': 90,
    'ঢাকার বাইরে': 130,
  };

  useEffect(() => {
    if (!cartItems || cartItems.length === 0) {
      toast.error("কোনো পণ্য চেকআউটের জন্য পাওয়া যায়নি। অনুগ্রহ করে প্রথমে একটি পণ্য নির্বাচন করুন।", {
        duration: 4000,
        position: 'top-center'
      });
      navigate('/cart', { state: { checkoutError: true } });
    }
  }, [cartItems, navigate]);

  const handlePaymentScreenshotChange = (e) => {
    const file = e.target.files[0];
    setPaymentScreenshotFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setPaymentScreenshotPreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setPaymentScreenshotPreview(null);
    }
  };

  const onSubmit = async (data) => {
    if (cartItems.length === 0) {
      toast.error("আপনার কার্টে কোনো পণ্য নেই");
      return;
    }

    let uploadedScreenshotInfo = null;
    if (selectedPaymentMethod === 'mobileBanking' && paymentScreenshotFile) {
      try {
        uploadedScreenshotInfo = await imageUpload(paymentScreenshotFile);
        toast.success("পেমেন্টের স্ক্রিনশট সফলভাবে আপলোড হয়েছে!");
      } catch (uploadError) {
        console.error("Payment screenshot upload failed:", uploadError);
        toast.error("পেমেন্টের স্ক্রিনশট আপলোড ব্যর্থ হয়েছে। অনুগ্রহ করে আবার চেষ্টা করুন।");
        return;
      }
    }

    try {
      const orderPayload = {
        customerInfo: {
          name: data.customerName,
          phoneNumber: data.customerNumber,
          address: data.customerAddress,
          userEmail: user?.email || data.customerEmail,
          userId: user?.uid || null,
          createAccount: data.createAccount,
          orderNotes: data.orderNotes || null,
        },
        orderItems: cartItems,
        subtotal: subtotal,
        shippingMethod: selectedShippingMethod,
        shippingCost: SHIPPING_COSTS[selectedShippingMethod] || 0,
        totalAmount: subtotal + (SHIPPING_COSTS[selectedShippingMethod] || 0),
        paymentMethod: data.paymentMethod,
        
        manualPayment: selectedPaymentMethod === 'mobileBanking' ? {
          transactionId: data.transactionId,
          paymentScreenshot: uploadedScreenshotInfo,
          mobileBankingType: data.mobileBankingType
        } : undefined,
      };

      const response = await axiosSecure.post('/order', orderPayload);

      if (response.data.orderId) {
        toast.success("অর্ডার সফলভাবে সম্পন্ন হয়েছে! অর্ডার আইডি: " + response.data.orderId);
        navigate('/thank-you', { 
          state: { 
            orderId: response.data.orderId, 
            orderDetails: orderPayload, 
            orderDate: new Date().toISOString() 
          } 
        });
      } else {
        toast.error("অর্ডার সম্পন্ন করা যায়নি। অনুগ্রহ করে আবার চেষ্টা করুন।");
      }

    } catch (error) {
      console.error("Error placing order:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "অর্ডার স্থাপন করার সময় একটি অপ্রত্যাশিত ত্রুটি হয়েছে।");
    }
  };

  if (!cartItems || cartItems.length === 0) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 mt-10"
    >
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">চেকআউট</h1>
      
      {/* Step Indicator */}
      <div className="flex justify-center items-center space-x-8 mb-10">
        <div className="flex flex-col items-center text-blue-600">
          <FaShoppingCart className="text-3xl mb-2" />
          <span className="text-sm font-semibold">কার্ট</span>
        </div>
        <div className="w-16 h-1 bg-blue-600 rounded"></div>
        <div className="flex flex-col items-center text-blue-600">
          <FaClipboardCheck className="text-3xl mb-2" />
          <span className="text-sm font-semibold">চেকআউট</span>
        </div>
        <div className="w-16 h-1 bg-gray-300 rounded"></div>
        <div className="flex flex-col items-center text-gray-400">
          <FaCreditCard className="text-3xl mb-2" />
          <span className="text-sm">পেমেন্ট</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 lg:p-8">
        <p className="text-lg text-gray-700 mb-6 text-center">
          অর্ডারটি কনফার্ম করতে ফর্মটি সম্পূর্ণ পূরণ করে নিচে **অর্ডার করুন** বাটনে ক্লিক করুন।
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section: Billing details */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">বিলিং বিবরণী</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="customerName" className="block text-gray-700 font-semibold mb-2">আপনার নাম লিখুন *</label>
                <input
                  type="text"
                  id="customerName"
                  {...register('customerName', { required: 'আপনার নাম প্রয়োজন' })}
                  className="input input-bordered w-full"
                  placeholder="আপনার নাম"
                  defaultValue={user?.displayName || ''}
                />
                {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>}
              </div>
              <div>
                <label htmlFor="customerNumber" className="block text-gray-700 font-semibold mb-2">আপনার ফোন নাম্বার *</label>
                <input
                  type="tel"
                  id="customerNumber"
                  {...register('customerNumber', { 
                    required: 'আপনার ফোন নাম্বার প্রয়োজন',
                    pattern: {
                      value: /^01[3-9]\d{8}$/,
                      message: 'সঠিক মোবাইল নাম্বার দিন'
                    }
                  })}
                  className="input input-bordered w-full"
                  placeholder="আপনার ফোন নাম্বার"
                />
                {errors.customerNumber && <p className="text-red-500 text-sm mt-1">{errors.customerNumber.message}</p>}
              </div>
              <div>
                <label htmlFor="customerAddress" className="block text-gray-700 font-semibold mb-2">সম্পূর্ণ ঠিকানা লিখুন *</label>
                <textarea
                  id="customerAddress"
                  rows="3"
                  {...register('customerAddress', { required: 'সম্পূর্ণ ঠিকানা প্রয়োজন' })}
                  className="textarea textarea-bordered w-full"
                  placeholder="গ্রাম, পোস্ট, উপজেলা, জেলা"
                />
                {errors.customerAddress && <p className="text-red-500 text-sm mt-1">{errors.customerAddress.message}</p>}
              </div>
              {!user && (
                <div>
                  <label htmlFor="customerEmail" className="block text-gray-700 font-semibold mb-2">ইমেইল (ঐচ্ছিক)</label>
                  <input
                    type="email"
                    id="customerEmail"
                    {...register('customerEmail', {
                      pattern: {
                        value: /^[A-Z0-9._%+-]+@[A-Z0-9.-]+\.[A-Z]{2,}$/i,
                        message: 'সঠিক ইমেইল দিন'
                      }
                    })}
                    className="input input-bordered w-full"
                    placeholder="উদাহরণ: example@example.com"
                  />
                  {errors.customerEmail && <p className="text-red-500 text-sm mt-1">{errors.customerEmail.message}</p>}
                </div>
              )}
              <div className="form-control">
                <label className="label cursor-pointer justify-start">
                  <input 
                    type="checkbox" 
                    {...register('createAccount')} 
                    className="checkbox checkbox-primary mr-2" 
                    disabled={!!user}
                  />
                  <span className="label-text">একটি অ্যাকাউন্ট তৈরি করুন?</span>
                </label>
              </div>
            </div>

            {/* Add Order Notes */}
            <div className="mt-6">
              <button
                type="button"
                onClick={() => setValue('addOrderNotes', !showOrderNotes)}
                className="text-blue-600 hover:underline flex items-center font-medium"
              >
                <FaPlus className={`mr-2 transition-transform ${showOrderNotes ? 'rotate-45' : 'rotate-0'}`} /> অর্ডারের জন্য নোট যোগ করুন
              </button>
              {showOrderNotes && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 overflow-hidden"
                >
                  <label htmlFor="orderNotes" className="block text-gray-700 font-semibold mb-2">অর্ডার নোটস (ঐচ্ছিক)</label>
                  <textarea
                    id="orderNotes"
                    rows="3"
                    {...register('orderNotes')}
                    className="textarea textarea-bordered w-full"
                    placeholder="আপনার অর্ডার সম্পর্কে নোট লিখুন, যেমন: বিশেষ ডেলিভারি নির্দেশনা।"
                  />
                </motion.div>
              )}
            </div>

            {/* Shipping Options */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-8 border-b pb-2">শিপিং</h2>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  {...register('shippingMethod', { required: 'শিপিং পদ্ধতি প্রয়োজন' })} 
                  value="ঢাকার ভেতরে" 
                  className="radio radio-primary mr-2" 
                />
                <span className="label-text flex-1">ঢাকার ভেতরে</span>
                <span className="font-semibold text-gray-700">৳{SHIPPING_COSTS['ঢাকার ভেতরে']}</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  {...register('shippingMethod')} 
                  value="ঢাকার বাইরে" 
                  className="radio radio-primary mr-2" 
                />
                <span className="label-text flex-1">ঢাকার বাইরে</span>
                <span className="font-semibold text-gray-700">৳{SHIPPING_COSTS['ঢাকার বাইরে']}</span>
              </label>
              {errors.shippingMethod && <p className="text-red-500 text-sm mt-1">{errors.shippingMethod.message}</p>}
            </div>
          </div>

          {/* Right Section: Your order */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">আপনার অর্ডার</h2>
            
            {/* Show all cart items */}
            <div className="max-h-96 overflow-y-auto mb-4">
              {cartItems.map((item, index) => (
                <div key={index} className="flex items-center space-x-4 mb-4 border-b pb-4">
                  <img
                    src={item.productImage || BASE64_FALLBACK_IMAGE}
                    alt={item.productName}
                    className="w-16 h-16 object-cover rounded-lg"
                    onError={(e) => { e.target.src = BASE64_FALLBACK_IMAGE; }}
                  />
                  <div className="flex-1">
                    <h3 className="font-bold text-gray-800">{item.productName}</h3>
                    {item.variant && (
                      <p className="text-sm text-gray-600">ভ্যারিয়েন্ট: {item.variant.color || item.variant}</p>
                    )}
                    <p className="text-sm text-gray-600">পরিমাণ: {item.quantity}</p>
                  </div>
                  <span className="text-lg font-bold text-gray-800">৳{(item.price * item.quantity).toFixed(2)}</span>
                </div>
              ))}
            </div>

            <div className="border-t pt-4 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>সাবটোটাল</span>
                <span>৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>শিপিং</span>
                <span>৳{(SHIPPING_COSTS[selectedShippingMethod] || 0).toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-800 border-t pt-2 mt-2">
                <span>মোট</span>
                <span>৳{(subtotal + (SHIPPING_COSTS[selectedShippingMethod] || 0)).toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-8 border-b pb-2">পেমেন্ট পদ্ধতি</h2>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  {...register('paymentMethod', { required: 'পেমেন্ট পদ্ধতি প্রয়োজন' })} 
                  value="cashOnDelivery" 
                  className="radio radio-primary mr-2" 
                />
                <span className="label-text flex-1">ক্যাশ অন ডেলিভারি</span>
                <span className="text-gray-500 text-sm">পণ্য হাতে পেয়ে পেমেন্ট করুন।</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input 
                  type="radio" 
                  {...register('paymentMethod')} 
                  value="mobileBanking" 
                  className="radio radio-primary mr-2" 
                />
                <span className="label-text flex-1">মোবাইল ব্যাংকিং / ব্যাংক পেমেন্ট</span>
                <span className="text-gray-500 text-sm">বিকাশ, নগদ, রকেট অথবা ব্যাংক ট্রান্সফার।</span>
              </label>
              {errors.paymentMethod && <p className="text-red-500 text-sm mt-1">{errors.paymentMethod.message}</p>}
            </div>

            {/* Manual Mobile Banking Payment Options */}
            {selectedPaymentMethod === 'mobileBanking' && (
              <motion.div
                initial={{ opacity: 0, height: 0 }}
                animate={{ opacity: 1, height: 'auto' }}
                transition={{ duration: 0.3 }}
                className="mt-4 p-4 border rounded-lg bg-gray-50 overflow-hidden space-y-4"
              >
                <h3 className="text-lg font-bold text-gray-800 mb-3">ম্যানুয়াল পেমেন্ট বিবরণী: মোবাইল ব্যাংকিং / ব্যাংক</h3>
                <p className="text-gray-700 text-base leading-relaxed">
                  আপনার অর্ডারটি নিশ্চিত করতে, অনুগ্রহ করে মোট পরিমাণ (<span className="font-bold text-xl text-blue-600">৳{(subtotal + (SHIPPING_COSTS[selectedShippingMethod] || 0)).toFixed(2)}</span>) নিচের যেকোনো একটি মোবাইল ব্যাংকিং নম্বর অথবা ব্যাংক একাউন্টে পাঠান:
                </p>
                <ul className="list-disc pl-5 text-gray-800 text-base space-y-2">
                  <li><span className="font-semibold text-blue-700">বিকাশ (পার্সোনাল):</span> <span className="font-bold">017XXXXXXXX</span></li>
                  <li><span className="font-semibold text-blue-700">নগদ (পার্সোনাল):</span> <span className="font-bold">018XXXXXXXX</span></li>
                  <li><span className="font-semibold text-blue-700">রকেট (পার্সোনাল):</span> <span className="font-bold">019XXXXXXXX</span></li>
                  <li><span className="font-semibold text-blue-700">ব্যাংক ট্রান্সফার:</span> <br />&nbsp;&nbsp;&nbsp;ব্যাংকের নাম: <span className="font-bold">উদাহরণ ব্যাংক</span> <br />&nbsp;&nbsp;&nbsp;একাউন্ট নং: <span className="font-bold">1234567890</span> <br />&nbsp;&nbsp;&nbsp;শাখা: <span className="font-bold">ঢাকা প্রধান শাখা</span></li>
                </ul>
                <p className="text-red-600 text-base font-bold mt-4">
                  পেমেন্ট সম্পন্ন করার পর, অনুগ্রহ করে নিচে আপনার ট্রানজেকশন আইডি এবং পেমেন্টের স্ক্রিনশট (ঐচ্ছিক) প্রদান করুন।
                </p>
                
                <div>
                  <label htmlFor="transactionId" className="block text-gray-700 font-semibold mb-2">ট্রানজেকশন আইডি *</label>
                  <input
                    type="text"
                    id="transactionId"
                    {...register('transactionId', { 
                      required: selectedPaymentMethod === 'mobileBanking' ? 'ট্রানজেকশন আইডি প্রয়োজন' : false 
                    })}
                    className="input input-bordered w-full"
                    placeholder="উদাহরণ: 8N7X2G5B"
                  />
                  {errors.transactionId && <p className="text-red-500 text-sm mt-1">{errors.transactionId.message}</p>}
                </div>
                <div>
                  <label htmlFor="paymentScreenshot" className="block text-gray-700 font-semibold mb-2">পেমেন্ট স্ক্রিনশট (ঐচ্ছিক)</label>
                  <input
                    type="file"
                    id="paymentScreenshot"
                    accept="image/*"
                    {...register('paymentScreenshot')}
                    onChange={handlePaymentScreenshotChange}
                    className="file-input file-input-bordered w-full"
                  />
                  {paymentScreenshotPreview && (
                    <img src={paymentScreenshotPreview} alt="Payment Screenshot Preview" className="mt-2 h-24 w-24 object-cover rounded-md" />
                  )}
                </div>
              </motion.div>
            )}

            <p className="text-sm text-gray-700 mt-6 text-center">
              অর্ডারটি কনফার্ম করতে নিচের বাটনে ক্লিক করুন।
            </p>

            <CustomButton
              type="submit"
              text="অর্ডার করুন"
              color="red"
              className="w-full mt-6 py-3 text-lg"
              disabled={false}
            />
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;