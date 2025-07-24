import React from 'react';
import { useParams } from 'react-router-dom';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { motion } from 'framer-motion';
import { FaStar, FaShippingFast, FaShieldAlt, FaBoxOpen, FaRulerCombined } from 'react-icons/fa';

const ProductDetails = () => {
    const { id } = useParams();
    const axiosSecure = useAxiosSecure();

    const { data: product, isLoading, isError, error } = useQuery({
        queryKey: ['productDetails', id],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/product/${id}`);
            return data;
        },
        enabled: !!id,
    });

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }

    if (isError) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                Error: {error.message}
            </div>
        );
    }

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                Product not found.
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8 bg-white rounded-lg shadow-md mt-10"
        >
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                {/* Product Images (Main Image Carousel/Gallery could go here) */}
                <div className="flex flex-col items-center">
                    <motion.img
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        src={product.images && product.images.length > 0 ? product.images[0] : 'https://placehold.co/600x400/E0E0E0/666666?text=No+Image'}
                        alt={product.productName}
                        className="w-full max-w-lg h-96 object-cover rounded-lg shadow-lg mb-4"
                    />
                    <div className="grid grid-cols-4 gap-2 w-full max-w-lg">
                        {product.images?.slice(1, 5).map((img, index) => (
                            <motion.img
                                key={index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                                src={img}
                                alt={`Thumbnail ${index}`}
                                className="w-full h-20 object-cover rounded-md cursor-pointer hover:border-blue-500 border-2 border-transparent transition-all"
                            />
                        ))}
                    </div>
                </div>

                {/* Product Details */}
                <div className="lg:pl-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.productName}</h1>
                    <p className="text-lg text-gray-600 mb-4">{product.category}</p>

                    <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-baseline space-x-2">
                            {product.specialPrice ? (
                                <>
                                    <span className="text-3xl font-bold text-blue-600">৳{product.specialPrice.toFixed(2)}</span>
                                    <span className="text-lg text-gray-500 line-through">৳{product.price.toFixed(2)}</span>
                                </>
                            ) : (
                                <span className="text-3xl font-bold text-gray-800">৳{product.price.toFixed(2)}</span>
                            )}
                        </div>
                        <div className="flex items-center text-yellow-500 text-lg">
                            <FaStar className="mr-1" /> {product.avgRating?.toFixed(1) || 'N/A'} ({product.reviewCount || 0} reviews)
                        </div>
                    </div>

                    {/* Variants */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Available Colors:</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.variants.map((variant, index) => (
                                    <span key={index} className="px-4 py-2 bg-gray-100 rounded-full text-gray-700 text-sm font-medium hover:bg-gray-200 transition-colors cursor-pointer">
                                        {variant.color}
                                        {variant.variantPrice && ` (৳${variant.variantPrice.toFixed(2)})`}
                                    </span>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity Selector and Add to Cart */}
                    <div className="flex items-center space-x-4 mb-6">
                        <input
                            type="number"
                            defaultValue="1"
                            min="1"
                            max={product.stock}
                            className="input input-bordered w-24 text-center"
                        />
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-primary text-white text-lg flex-1"
                        >
                            <FaCartPlus className="mr-2" /> Add to Cart
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-outline btn-secondary text-lg"
                        >
                            <FaHeart />
                        </motion.button>
                    </div>

                    {/* Specifications and Shipping Info */}
                    <div className="border-t pt-6 mt-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Specifications:</h3>
                        <ul className="text-gray-700 space-y-2">
                            {product.brand && <li><strong>Brand:</strong> {product.brand}</li>}
                            {product.specifications?.model && <li><strong>Model:</strong> {product.specifications.model}</li>}
                            {product.specifications?.material && <li><strong>Material:</strong> {product.specifications.material}</li>}
                            <li><strong>Available Stock:</strong> {product.stock} units</li>
                        </ul>
                    </div>

                    <div className="border-t pt-6 mt-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Shipping & Warranty:</h3>
                        <ul className="text-gray-700 space-y-2">
                            {product.shippingInfo?.weight && <li><FaShippingFast className="inline mr-2" /> <strong>Weight:</strong> {product.shippingInfo.weight} kg</li>}
                            {product.shippingInfo?.length && product.shippingInfo?.width && product.shippingInfo?.height && (
                                <li><FaRulerCombined className="inline mr-2" /> <strong>Dimensions:</strong> {product.shippingInfo.length}L x {product.shippingInfo.width}W x {product.shippingInfo.height}H cm</li>
                            )}
                            <li><FaBoxOpen className="inline mr-2" /> <strong>Dangerous Goods:</strong> {product.shippingInfo?.isDangerous ? 'Yes' : 'No'}</li>
                            {product.warrantyInfo?.type && <li><FaShieldAlt className="inline mr-2" /> <strong>Warranty:</strong> {product.warrantyInfo.type} ({product.warrantyInfo.period})</li>}
                        </ul>
                    </div>

                    <div className="border-t pt-6 mt-6 text-sm text-gray-500">
                        <p>Sold by: {product.sellerName} ({product.sellerEmail})</p>
                        <p>Product ID: {product._id}</p>
                    </div>
                </div>
            </div>
        </motion.div>
    );
};

export default ProductDetails;