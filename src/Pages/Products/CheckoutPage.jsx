import React, { useState, useEffect, useContext } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import useAxiosSecure from '../../hooks/useAxiosSecure'; // Correct import for useAxiosSecure
import { AuthContext } from '../../Context/AuthProvider';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaShoppingCart, FaClipboardCheck, FaCreditCard, FaPlus, FaCamera } from 'react-icons/fa'; // FaCamera for screenshot
import CustomButton from '../../components/CustomButton'; // Import your CustomButton
import { imageUpload } from '../../API/utilis'; // Import imageUpload utility

const CheckoutPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure(); // FIXED: Get axiosSecure from its hook
  const { user } = useContext(AuthContext);

  const BASE64_FALLBACK_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXRSTlMAQObYZgAAAFpJUVORK5CYII=';

  const { product, quantity = 1, selectedVariant } = location.state || {}; 

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

  const parseNumber = (value) => {
    if (typeof value === 'object' && value !== null && (value?.$numberInt !== undefined || value?.$numberDouble !== undefined)) {
      return parseFloat(value.$numberInt || value.$numberDouble);
    }
    return parseFloat(value) || 0;
  };
  const productPrice = selectedVariant?.variantPrice ? parseNumber(selectedVariant.variantPrice) : (product ? parseNumber(product.price) : 0);

  const subtotal = productPrice * quantity;
  const shippingCost = SHIPPING_COSTS[selectedShippingMethod] || 0;
  const totalAmount = subtotal + shippingCost;

  useEffect(() => {
    if (!product) {
      toast.error("No product found for checkout. Please select a product first.");
      navigate('/all-products');
    }
  }, [product, navigate]);

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
    let uploadedScreenshotInfo = null;
    if (selectedPaymentMethod === 'mobileBanking' && paymentScreenshotFile) {
        try {
            // Upload screenshot to Cloudinary
            uploadedScreenshotInfo = await imageUpload(paymentScreenshotFile);
            toast.success("Payment screenshot uploaded!");
        } catch (uploadError) {
            console.error("Payment screenshot upload failed:", uploadError);
            toast.error("Payment screenshot upload failed. Please try again.");
            return; // Stop submission if screenshot fails
        }
    }

    try {
      const orderItems = [{
        productId: product._id,
        productName: product.productName,
        productImage: product.images?.[0]?.url || null,
        price: productPrice,
        quantity: quantity,
        variant: selectedVariant ? {
          color: selectedVariant.color,
          variantPrice: parseNumber(selectedVariant.variantPrice),
          variantStock: parseInt(selectedVariant.variantStock),
          sellerSku: selectedVariant.sellerSku
        } : null,
        sellerEmail: product.sellerEmail,
        sellerUid: product.sellerUid,
      }];

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
        orderItems: orderItems,
        subtotal: subtotal,
        shippingMethod: selectedShippingMethod,
        shippingCost: shippingCost,
        totalAmount: totalAmount,
        paymentMethod: data.paymentMethod,
        
        manualPayment: selectedPaymentMethod === 'mobileBanking' ? {
            transactionId: data.transactionId,
            paymentScreenshot: uploadedScreenshotInfo, // Store uploaded screenshot info {url, public_id}
            mobileBankingType: data.mobileBankingType // e.g., Bkash, Nagad
        } : undefined,
      };

      const response = await axiosSecure.post('/order', orderPayload);

      if (response.data.orderId) {
        toast.success("Order placed successfully! Order ID: " + response.data.orderId);
        navigate('/order-success', { state: { orderId: response.data.orderId } });
      } else {
        toast.error("Failed to place order.");
      }

    } catch (error) {
      console.error("Error placing order:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "An unexpected error occurred while placing your order.");
    }
  };

  if (!product) {
    return null;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto px-4 py-8 mt-10"
    >
      <h1 className="text-4xl font-bold text-gray-800 text-center mb-6">CHECK OUT</h1>
      
      {/* Step Indicator */}
      <div className="flex justify-center items-center space-x-8 mb-10">
        <div className="flex flex-col items-center text-blue-600">
          <FaShoppingCart className="text-3xl mb-2" />
          <span className="text-sm font-semibold">Cart</span>
        </div>
        <div className="w-16 h-1 bg-blue-600 rounded"></div>
        <div className="flex flex-col items-center text-blue-600">
          <FaClipboardCheck className="text-3xl mb-2" />
          <span className="text-sm font-semibold">Checkout</span>
        </div>
        <div className="w-16 h-1 bg-gray-300 rounded"></div>
        <div className="flex flex-col items-center text-gray-400">
          <FaCreditCard className="text-3xl mb-2" />
          <span className="text-sm">Payment</span>
        </div>
      </div>

      <div className="bg-white rounded-lg shadow-md p-6 lg:p-8">
        <p className="text-lg text-gray-700 mb-6 text-center">
          অর্ডারটি কনফার্ম করতে ফর্মটি সম্পূর্ণ পূরণ করে নিচে **Place Order** বাটনে ক্লিক করুন।
        </p>

        <form onSubmit={handleSubmit(onSubmit)} className="grid grid-cols-1 lg:grid-cols-2 gap-8">
          {/* Left Section: Billing details */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Billing details</h2>
            <div className="space-y-4">
              <div>
                <label htmlFor="customerName" className="block text-gray-700 font-semibold mb-2">আপনার নাম লিখুন *</label>
                <input
                  type="text"
                  id="customerName"
                  {...register('customerName', { required: 'Your Name is required' })}
                  className="input input-bordered w-full"
                  placeholder="Your Name"
                  defaultValue={user?.displayName || ''}
                />
                {errors.customerName && <p className="text-red-500 text-sm mt-1">{errors.customerName.message}</p>}
              </div>
              <div>
                <label htmlFor="customerNumber" className="block text-gray-700 font-semibold mb-2">আপনার নাম্বার *</label>
                <input
                  type="tel"
                  id="customerNumber"
                  {...register('customerNumber', { required: 'Your Number is required' })}
                  className="input input-bordered w-full"
                  placeholder="Your Number"
                />
                {errors.customerNumber && <p className="text-red-500 text-sm mt-1">{errors.customerNumber.message}</p>}
              </div>
              <div>
                <label htmlFor="customerAddress" className="block text-gray-700 font-semibold mb-2">Enter the full address here *</label>
                <textarea
                  id="customerAddress"
                  rows="3"
                  {...register('customerAddress', { required: 'Full address is required' })}
                  className="textarea textarea-bordered w-full"
                  placeholder="গ্রাম, পোস্ট, উপজেলা, জেলা"
                />
                {errors.customerAddress && <p className="text-red-500 text-sm mt-1">{errors.customerAddress.message}</p>}
              </div>
              {!user && (
                <div>
                  <label htmlFor="customerEmail" className="block text-gray-700 font-semibold mb-2">Email (Optional)</label>
                  <input
                    type="email"
                    id="customerEmail"
                    {...register('customerEmail')}
                    className="input input-bordered w-full"
                    placeholder="example@example.com"
                  />
                </div>
              )}
              <div className="form-control">
                <label className="label cursor-pointer justify-start">
                  <input type="checkbox" {...register('createAccount')} className="checkbox checkbox-primary mr-2" disabled />
                  <span className="label-text">Create an account?</span>
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
                <FaPlus className={`mr-2 transition-transform ${showOrderNotes ? 'rotate-45' : 'rotate-0'}`} /> Add Order Notes
              </button>
              {showOrderNotes && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  transition={{ duration: 0.3 }}
                  className="mt-4 overflow-hidden"
                >
                  <label htmlFor="orderNotes" className="block text-gray-700 font-semibold mb-2">Order Notes (Optional)</label>
                  <textarea
                    id="orderNotes"
                    rows="3"
                    {...register('orderNotes')}
                    className="textarea textarea-bordered w-full"
                    placeholder="Notes about your order, e.g., special delivery instructions."
                  />
                </motion.div>
              )}
            </div>

            {/* Shipping Options */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-8 border-b pb-2">Shipping</h2>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer">
                <input type="radio" {...register('shippingMethod', { required: 'Shipping method is required' })} value="ঢাকার ভেতরে" className="radio radio-primary mr-2" />
                <span className="label-text flex-1">ঢাকার ভেতরে</span>
                <span className="font-semibold text-gray-700">৳{SHIPPING_COSTS['ঢাকার ভেতরে']}</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input type="radio" {...register('shippingMethod')} value="ঢাকার বাইরে" className="radio radio-primary mr-2" />
                <span className="label-text flex-1">ঢাকার বাইরে</span>
                <span className="font-semibold text-gray-700">৳{SHIPPING_COSTS['ঢাকার বাইরে']}</span>
              </label>
              {errors.shippingMethod && <p className="text-red-500 text-sm mt-1">{errors.shippingMethod.message}</p>}
            </div>
          </div>

          {/* Right Section: Your order */}
          <div>
            <h2 className="text-2xl font-bold text-gray-800 mb-4 border-b pb-2">Your order</h2>
            <div className="flex items-center space-x-4 mb-4">
              <img
                src={product.images?.[0]?.url || BASE64_FALLBACK_IMAGE}
                alt={product.productName}
                className="w-24 h-24 object-cover rounded-lg"
                onError={e => { e.target.src = BASE64_FALLBACK_IMAGE; }}
              />
              <div>
                <h3 className="font-bold text-gray-800">{product.productName}</h3>
                {selectedVariant && (
                  <p className="text-sm text-gray-600">Variant: {selectedVariant.color}</p>
                )}
                <p className="text-sm text-gray-600">Quantity: {quantity}</p>
              </div>
              <span className="text-lg font-bold text-gray-800 ml-auto">৳{subtotal.toFixed(2)}</span>
            </div>

            <div className="border-t pt-4 mt-4 space-y-2">
              <div className="flex justify-between text-gray-700">
                <span>Subtotal</span>
                <span>৳{subtotal.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-gray-700">
                <span>Shipping</span>
                <span>৳{shippingCost.toFixed(2)}</span>
              </div>
              <div className="flex justify-between text-xl font-bold text-gray-800 border-t pt-2 mt-2">
                <span>Total</span>
                <span>৳{totalAmount.toFixed(2)}</span>
              </div>
            </div>

            {/* Payment Method */}
            <h2 className="text-2xl font-bold text-gray-800 mb-4 mt-8 border-b pb-2">Payment Method</h2>
            <div className="space-y-3">
              <label className="flex items-center cursor-pointer">
                <input type="radio" {...register('paymentMethod', { required: 'Payment method is required' })} value="cashOnDelivery" className="radio radio-primary mr-2" />
                <span className="label-text flex-1">Cash on delivery</span>
                <span className="text-gray-500 text-sm">Pay with cash upon delivery.</span>
              </label>
              <label className="flex items-center cursor-pointer">
                <input type="radio" {...register('paymentMethod')} value="mobileBanking" className="radio radio-primary mr-2" />
                <span className="label-text flex-1">Pay with Mobile Banking / Bank</span>
                <span className="text-gray-500 text-sm">Bkash, Nagad, Rocket or Bank Transfer.</span>
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
                    <h3 className="text-lg font-bold text-gray-800">ম্যানুয়াল মোবাইল ব্যাংকিং / ব্যাংক পেমেন্টের বিবরণ</h3>
                    <p className="text-gray-700 text-sm">
                        আপনার অর্ডারটি নিশ্চিত করতে, অনুগ্রহ করে মোট পরিমাণ (৳{totalAmount.toFixed(2)}) নিচের যেকোনো একটি মোবাইল ব্যাংকিং নম্বরে বা ব্যাংক একাউন্টে পাঠান:
                    </p>
                    <ul className="list-disc pl-5 text-gray-700 text-lg space-y-1 font-semi-bold ">
                        <li>বিকাশ (পার্সোনাল): 017XXXXXXXX</li>
                        <li>নগদ (পার্সোনাল): 018XXXXXXXX</li>
                        <li>রকেট (পার্সোনাল):019XXXXXXXX</li>
                        <li>ব্যাংক ট্রান্সফার: ব্যাংকের নাম: উদাহরণ ব্যাংক, একাউন্ট নং: 1234567890, শাখা: ঢাকা প্রধান শাখা</li>
                    </ul>
                    <p className=" text-lg font-semibold text-red-400">
                        পেমেন্ট সম্পন্ন করার পর, অনুগ্রহ করে নিচে আপনার ট্রানজেকশন আইডি এবং পেমেন্টের স্ক্রিনশট প্রদান করুন।
                    </p>
                    
                    <div>
                        <label htmlFor="transactionId" className="block text-gray-700 font-semibold mb-2">ট্রানজেকশন আইডি *</label>
                        <input
                            type="text"
                            id="transactionId"
                            {...register('transactionId', { required: 'ট্রানজেকশন আইডি প্রয়োজন' })}
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
                            onChange={handlePaymentScreenshotChange} // Add change handler
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

            <CustomButton // Using CustomButton component
              type="submit"
              text="অর্ডার করুন"
              color="red" // Set color to red
              className="w-full mt-6 py-3 text-lg" // Adjust padding/size as needed for CustomButton
              disabled={false} // Adjust based on form validation/loading
            />
          </div>
        </form>
      </div>
    </motion.div>
  );
};

export default CheckoutPage;