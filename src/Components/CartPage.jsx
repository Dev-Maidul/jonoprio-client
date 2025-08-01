import React from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import useCart from '../Hooks/useCart';
import { FiTrash2, FiPlus, FiMinus } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';
import toast from 'react-hot-toast';

const CartPage = () => {
  const { 
    cart, 
    loading, 
    error, 
    updateQuantity, 
    removeItem, 
    getTotalItems, 
    getSubtotal,
    clearCart
  } = useCart();

  const navigate = useNavigate();
  const location = useLocation();

  // Check for checkout error in location state
  React.useEffect(() => {
    if (location.state?.checkoutError) {
      toast.error(location.state.checkoutError, {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#fef2f2',
          color: '#b91c1c',
          fontWeight: '500',
        },
      });
      navigate(location.pathname, { replace: true, state: {} });
    }
  }, [location, navigate]);

  if (loading) {
    return (
      <div className="container mx-auto p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-gray-600 text-lg"
        >
          Loading cart...
        </motion.div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container mx-auto p-6">
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center text-red-500 text-lg"
        >
          Error: {error}
        </motion.div>
      </div>
    );
  }

  const handleQuantityChange = (productId, change) => {
    const item = cart.find(item => item._id.$oid === productId);
    if (!item) return;
    
    const currentQty = parseInt(item.quantity.$numberInt);
    const newQty = currentQty + change;
    
    if (newQty > 0) {
      updateQuantity(productId, newQty);
    } else if (newQty === 0) {
      removeItem(productId);
    }
  };

  const handleCheckout = () => {
    if (cart.length === 0) {
      toast.error('Your cart is empty. Please add some products before proceeding to checkout.', {
        duration: 4000,
        position: 'top-center',
        style: {
          background: '#fef2f2',
          color: '#b91c1c',
          fontWeight: '500',
        },
      });
      navigate('/all-products');
      return;
    }
    
    const checkoutItems = cart.map(item => ({
      productId: item._id.$oid,
      productName: item.productName,
      productImage: item.productImage,
      price: parseInt(item.price),
      quantity: parseInt(item.quantity.$numberInt),
      variant: item.variant,
    }));

    navigate('/checkout', {
      state: {
        fromCart: true,
        cartItems: checkoutItems,
        subtotal: getSubtotal(),
        totalItems: getTotalItems(),
      },
    });
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="container mx-auto p-6 max-w-7xl"
    >
      <h1 className="text-3xl md:text-4xl font-bold text-gray-800 text-center mb-8 tracking-tight">
        Your Shopping Cart
      </h1>
      
      <AnimatePresence>
        {cart.length === 0 ? (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="text-center py-12 bg-white rounded-lg shadow-md"
          >
            <h2 className="text-xl font-medium text-gray-600 mb-4">Your cart is empty</h2>
            <Link
              to="/all-products"
              className="inline-block bg-gradient-to-r from-indigo-600 to-blue-500 text-white px-8 py-3 rounded-lg shadow-md hover:from-indigo-700 hover:to-blue-600 transition-all duration-300"
            >
              Continue Shopping
            </Link>
          </motion.div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Cart Items */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="lg:w-2/3"
            >
              <div className="bg-white rounded-lg shadow-md overflow-hidden">
                <div className="hidden md:grid grid-cols-12 bg-gray-100 p-4 border-b font-semibold text-gray-700 text-sm uppercase tracking-wide">
                  <div className="col-span-5">Product</div>
                  <div className="col-span-2 text-center">Price</div>
                  <div className="col-span-3 text-center">Quantity</div>
                  <div className="col-span-2 text-right">Total</div>
                </div>
                
                <AnimatePresence>
                  {cart.map(item => (
                    <motion.div
                      key={item._id.$oid}
                      initial={{ opacity: 0, y: 10 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -10 }}
                      transition={{ duration: 0.3 }}
                      className="p-4 md:p-6 border-b last:border-b-0 hover:bg-gray-50 transition duration-200"
                    >
                      <div className="flex flex-col md:grid md:grid-cols-12 gap-4 items-center">
                        <div className="md:col-span-5 flex items-center gap-4">
                          <img
                            src={item.productImage}
                            alt={item.productName}
                            className="w-20 h-20 md:w-24 md:h-24 object-cover rounded-lg border border-gray-200"
                            onError={(e) => {
                              e.target.src = 'https://via.placeholder.com/100';
                            }}
                          />
                          <div>
                            <h3 className="text-base md:text-lg font-semibold text-gray-800">{item.productName}</h3>
                            {item.variant && (
                              <p className="text-sm text-gray-500">{item.variant.color || item.variant}</p>
                            )}
                          </div>
                        </div>
                        
                        <div className="md:col-span-2 text-center font-medium text-gray-700">
                          ${parseInt(item.price).toLocaleString()}
                        </div>
                        
                        <div className="md:col-span-3 flex items-center justify-center">
                          <div className="flex items-center gap-2 bg-gray-100 rounded-full p-1">
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleQuantityChange(item._id.$oid, -1)}
                              className="p-2 rounded-full hover:bg-gray-200 transition"
                              aria-label="Decrease quantity"
                            >
                              <FiMinus className="text-gray-600" />
                            </motion.button>
                            <span className="w-12 text-center font-medium">{parseInt(item.quantity.$numberInt)}</span>
                            <motion.button
                              whileHover={{ scale: 1.1 }}
                              whileTap={{ scale: 0.9 }}
                              onClick={() => handleQuantityChange(item._id.$oid, 1)}
                              className="p-2 rounded-full hover:bg-gray-200 transition"
                              aria-label="Increase quantity"
                            >
                              <FiPlus className="text-gray-600" />
                            </motion.button>
                          </div>
                        </div>
                        
                        <div className="md:col-span-2 flex items-center justify-end gap-4">
                          <div className="font-medium text-gray-700">
                            ${(parseInt(item.price) * parseInt(item.quantity.$numberInt)).toLocaleString()}
                          </div>
                          <motion.button
                            whileHover={{ scale: 1.1 }}
                            whileTap={{ scale: 0.9 }}
                            onClick={() => removeItem(item._id.$oid)}
                            className="p-2 text-gray-400 hover:text-red-500 rounded-full hover:bg-red-100 transition"
                            aria-label="Remove item"
                          >
                            <FiTrash2 />
                          </motion.button>
                        </div>
                      </div>
                    </motion.div>
                  ))}
                </AnimatePresence>
              </div>
            </motion.div>
            
            {/* Order Summary */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="lg:w-1/3"
            >
              <div className="bg-white rounded-lg shadow-md p-6 sticky top-6">
                <h2 className="text-xl md:text-2xl font-bold text-gray-800 mb-6">Order Summary</h2>
                
                <div className="space-y-4 mb-6">
                  <div className="flex justify-between text-gray-600">
                    <span>Subtotal ({getTotalItems()} items)</span>
                    <span className="font-medium">${getSubtotal().toLocaleString()}</span>
                  </div>
                  
                  <div className="flex justify-between text-gray-600">
                    <span>Shipping</span>
                    <span className="font-medium text-green-600">Free</span>
                  </div>
                  
                  <div className="flex justify-between pt-4 border-t border-gray-200">
                    <span className="font-bold text-gray-800">Total</span>
                    <span className="font-bold text-lg text-gray-800">${getSubtotal().toLocaleString()}</span>
                  </div>
                </div>
                
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  onClick={handleCheckout}
                  className={`w-full py-3 rounded-lg font-medium text-white transition-all duration-300 ${
                    cart.length === 0
                      ? 'bg-gray-400 cursor-not-allowed'
                      : 'bg-gradient-to-r from-indigo-600 to-blue-500 hover:from-indigo-700 hover:to-blue-600'
                  }`}
                  disabled={cart.length === 0}
                  aria-label="Proceed to checkout"
                >
                  Proceed to Checkout
                </motion.button>
                
                <div className="mt-4 text-sm text-gray-500 text-center">
                  or{' '}
                  <Link to="/all-products" className="text-indigo-600 hover:underline font-medium">
                    Continue Shopping
                  </Link>
                </div>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default CartPage;