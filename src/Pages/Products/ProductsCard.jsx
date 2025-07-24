import React from 'react';
import { motion } from 'framer-motion';
import { FaHeart, FaEye, FaCartPlus, FaStar } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const ProductsCard = ({ product }) => {
    const { _id, productName, images, price, specialPrice, category, avgRating } = product;

    return (
        <motion.div
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            whileHover={{ scale: 1.03, boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)" }}
            className="bg-white rounded-lg shadow-md overflow-hidden relative cursor-pointer group"
        >
            {/* Product Image */}
            <div className="relative w-full h-60 overflow-hidden">
                <img
                    src={images && images.length > 0 ? images[0] : 'https://placehold.co/400x400/E0E0E0/666666?text=No+Image'}
                    alt={productName}
                    className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-110"
                />
                {/* Quick Action Buttons on Hover */}
                {/* Fixed: Removed black overlay, buttons slide up from bottom */}
                <div 
                    className="absolute inset-x-0 bottom-0 py-3 flex items-center justify-center space-x-3 
                               opacity-0 group-hover:opacity-100 transition-opacity duration-300 
                               transform translate-y-full group-hover:translate-y-0 bg-gradient-to-t from-gray-900 via-transparent to-transparent"
                    style={{ background: 'linear-gradient(to top, rgba(0,0,0,0.6), rgba(0,0,0,0.1), rgba(0,0,0,0))' }}
                >
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 rounded-full bg-white bg-opacity-80 text-gray-800 hover:bg-gray-200 transition-colors duration-200 backdrop-blur-sm"
                        title="Add to Wishlist"
                    >
                        <FaHeart />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 rounded-full bg-white bg-opacity-80 text-gray-800 hover:bg-gray-200 transition-colors duration-200 backdrop-blur-sm"
                        title="Quick View"
                    >
                        <FaEye />
                    </motion.button>
                    <motion.button
                        whileHover={{ scale: 1.1 }}
                        whileTap={{ scale: 0.9 }}
                        className="p-3 rounded-full bg-blue-600 text-white hover:bg-blue-700 transition-colors duration-200"
                        title="Add to Cart"
                    >
                        <FaCartPlus />
                    </motion.button>
                </div>
            </div>

            {/* Product Info */}
            <div className="p-4">
                <h3 className="text-lg font-semibold text-gray-800 truncate mb-1">
                    <Link to={`/product/${_id}`} className="hover:text-blue-600 transition-colors duration-200">
                        {productName}
                    </Link>
                </h3>
                <p className="text-sm text-gray-500 mb-2">{category}</p>
                <div className="flex items-center justify-between">
                    <div className="flex items-baseline space-x-2">
                        {specialPrice ? (
                            <>
                                <span className="text-xl font-bold text-blue-600">৳{specialPrice.toFixed(2)}</span>
                                <span className="text-sm text-gray-500 line-through">৳{price.toFixed(2)}</span>
                            </>
                        ) : (
                            <span className="text-xl font-bold text-gray-800">৳{price.toFixed(2)}</span>
                        )}
                    </div>
                    <div className="flex items-center text-yellow-500 text-sm">
                        <FaStar className="mr-1" /> {avgRating?.toFixed(1) || 'N/A'}
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductsCard;