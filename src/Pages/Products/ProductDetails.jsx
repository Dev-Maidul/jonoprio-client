import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaShippingFast, FaShieldAlt, FaBoxOpen, FaRulerCombined, FaCartPlus, FaHeart, FaTimes, FaPlayCircle, FaEye, FaPlus, FaMinus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

const ProductDetails = () => {
    const { id } = useParams();
    const navigate = useNavigate();
    const axiosSecure = useAxiosSecure();
    const [mainImage, setMainImage] = useState(null);
    const [isImageModalOpen, setIsImageModalOpen] = useState(false);
    const [quantity, setQuantity] = useState(1);
    const [totalPrice, setTotalPrice] = useState(0);
    const [selectedVariant, setSelectedVariant] = useState(null);
    const [reviews, setReviews] = useState([]);

    // Fetch product details
    const { data: product, isLoading, isError, error } = useQuery({
        queryKey: ['productDetails', id],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/product/${id}`);
            return data;
        },
        enabled: !!id,
        onSuccess: (data) => {
            if (data && data.images && data.images.length > 0) {
                const firstImage = data.images[0];
                if (firstImage && firstImage.url) {
                    setMainImage(firstImage);
                    console.log("Product images data on success:", data.images);
                    console.log("Main image URL set to:", firstImage.url);
                } else {
                    console.error("No valid URL in first image object:", firstImage);
                    setMainImage({ url: 'https://via.placeholder.com/600x400?text=Image+Not+Available' });
                }
            } else {
                console.error("No images found in product data:", data);
                setMainImage({ url: 'https://via.placeholder.com/600x400?text=Image+Not+Available' });
            }
            if (data.variants && data.variants.length > 0) {
                setSelectedVariant(data.variants[0]);
            }
        },
        onError: (err) => {
            console.error("ProductDetails fetch error:", err.message);
            toast.error("Failed to load product details.");
        },
    });

    // Fetch related products
    const { data: relatedProducts = [] } = useQuery({
        queryKey: ['relatedProducts', product?.category],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/products?category=${product?.category}&limit=4`);
            return data.filter((p) => p._id !== id);
        },
        enabled: !!product?.category,
    });

    // Fetch product reviews
    const { data: productReviews = [] } = useQuery({
        queryKey: ['productReviews', id],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/reviews/${id}`);
            return data;
        },
        enabled: !!id,
        onSuccess: (data) => {
            setReviews(data);
        },
    });

    // Mutation for adding to cart
    const addToCartMutation = useMutation({
        mutationFn: async () => {
            const payload = {
                productId: id,
                quantity,
                variant: selectedVariant,
            };
            return await axiosSecure.post('/cart/add', payload);
        },
        onSuccess: () => {
            toast.success("Added to cart successfully!");
        },
        onError: () => {
            toast.error("Failed to add to cart.");
        },
    });

    // Mutation for adding to wishlist
    const addToWishlistMutation = useMutation({
        mutationFn: async () => {
            return await axiosSecure.post(`/wishlist/add/${id}`);
        },
        onSuccess: () => {
            toast.success("Added to wishlist!");
        },
        onError: () => {
            toast.error("Failed to add to wishlist.");
        },
    });

    // Parse numbers for price, ratings, etc.
    const parseNumber = (value) => {
        if (typeof value === 'object' && value !== null && (value?.$numberInt || value?.$numberDouble)) {
            return parseFloat(value.$numberInt || value.$numberDouble);
        }
        return parseFloat(value) || 0;
    };
    const parseIntValue = (value) => {
        if (typeof value === 'object' && value !== null && (value?.$numberInt || value?.$numberDouble)) {
            return parseInt(value.$numberInt || value.$numberDouble);
        }
        return parseInt(value) || 0;
    };

    const priceValue = selectedVariant?.variantPrice ? parseNumber(selectedVariant.variantPrice) : (product ? parseNumber(product.price) : 0);
    const specialPriceValue = product ? parseNumber(product.specialPrice) : 0;
    const avgRatingValue = product ? parseNumber(product.avgRating) : 0;
    const reviewCountValue = product ? parseIntValue(product.reviewCount) : 0;
    const stockValue = selectedVariant?.stock ? parseIntValue(selectedVariant.stock) : (product ? parseIntValue(product.stock) : 0);

    const discountPercentage = specialPriceValue && priceValue && priceValue > 0 && specialPriceValue < priceValue
        ? Math.round(((priceValue - specialPriceValue) / priceValue) * 100)
        : 0;

    // Update total price
    useEffect(() => {
        if (product) {
            const currentPrice = specialPriceValue && specialPriceValue < priceValue ? specialPriceValue : priceValue;
            setTotalPrice(currentPrice * quantity);
        }
    }, [quantity, priceValue, specialPriceValue, product, selectedVariant]);

    // Handle quantity changes
    const handleQuantityChange = (e) => {
        const newQuantity = parseInt(e.target.value);
        if (!isNaN(newQuantity) && newQuantity > 0 && newQuantity <= stockValue) {
            setQuantity(newQuantity);
        } else if (newQuantity > stockValue) {
            setQuantity(stockValue);
            toast.error(`Maximum quantity available is ${stockValue}`);
        } else if (newQuantity <= 0 && stockValue > 0) {
            setQuantity(1);
        }
    };

    // Increment/Decrement quantity
    const incrementQuantity = () => {
        if (quantity < stockValue) {
            setQuantity(quantity + 1);
        } else {
            toast.error(`Maximum quantity available is ${stockValue}`);
        }
    };
    const decrementQuantity = () => {
        if (quantity > 1) {
            setQuantity(quantity - 1);
        }
    };

    // Handle variant selection
    const handleVariantSelect = (variant) => {
        setSelectedVariant(variant);
        setQuantity(1);
    };

    // Get YouTube embed URL
    const getYouTubeEmbedUrl = (url) => {
        if (!url) return null;
        const youtubeRegex = /(?:https?:\/\/)?(?:www\.)?(?:m\.)?(?:youtube\.com|youtu\.be)\/(?:watch\?v=|embed\/|v\/|)([\w-]{11})(?:\S+)?/;
        const match = url.match(youtubeRegex);
        return match && match[1] ? `https://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0` : null;
    };

    const productVideoEmbedUrl = getYouTubeEmbedUrl(product?.videoUrl);

    if (isLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4">
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 w-full max-w-7xl">
                    <Skeleton height={400} width="100%" />
                    <div>
                        <Skeleton height={40} width="80%" className="mb-4" />
                        <Skeleton height={20} width="50%" className="mb-4" />
                        <Skeleton height={60} width="100%" className="mb-4" />
                        <Skeleton count={5} height={20} width="100%" />
                    </div>
                </div>
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
                {/* Product Images & Video */}
                <div className="flex flex-col items-center">
                    <motion.div
                        className="relative w-full max-w-lg h-96 overflow-hidden rounded-lg shadow-lg mb-4 cursor-pointer group"
                        initial={{ opacity: 0, scale: 0.9 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.5, delay: 0.2 }}
                        onClick={() => setIsImageModalOpen(true)}
                        role="button"
                        aria-label="View larger image"
                    >
                        <img
                            src={mainImage?.url || 'https://via.placeholder.com/600x400?text=Image+Not+Available'}
                            alt={product.productName || 'Product Image'}
                            className="w-full h-full object-contain bg-white transition-transform duration-300 group-hover:scale-105 origin-center"
                            onError={(e) => {
                                console.error("Image failed to load, using fallback:", e.target.src);
                                e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Available';
                            }}
                        />
                        <div className="absolute inset-0 flex items-center justify-center bg-black bg-opacity-0 group-hover:bg-opacity-20 transition-all duration-300">
                            <FaEye className="text-white text-4xl opacity-0 group-hover:opacity-100 transition-opacity" />
                        </div>
                    </motion.div>

                    {/* Thumbnails */}
                    <div className="grid grid-cols-4 gap-2 w-full max-w-lg">
                        {product.images?.map((img, index) => (
                            <motion.img
                                key={img.public_id || index}
                                initial={{ opacity: 0, scale: 0.8 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3, delay: 0.3 + index * 0.1 }}
                                src={img.url || 'https://via.placeholder.com/150?text=Thumbnail+Not+Available'}
                                alt={`Thumbnail ${index + 1} of ${product.productName || 'Product'}`}
                                className={`w-full h-20 object-cover rounded-md cursor-pointer transition-all ${mainImage?.url === img.url ? 'border-blue-500 border-2' : 'border-2 border-transparent'}`}
                                onClick={() => setMainImage(img)}
                                onError={(e) => {
                                    console.error("Thumbnail failed to load:", e.target.src);
                                    e.target.src = 'https://via.placeholder.com/150?text=Thumbnail+Not+Available';
                                }}
                                role="button"
                                aria-label={`Select thumbnail ${index + 1}`}
                            />
                        ))}
                    </div>

                    {/* Product Video */}
                    {productVideoEmbedUrl && (
                        <div className="mt-8 w-full max-w-lg">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3 flex items-center">
                                <FaPlayCircle className="mr-2 text-red-500" /> Product Video
                            </h3>
                            <motion.div
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.5, delay: 0.5 }}
                                className="relative w-full"
                                style={{ paddingTop: '56.25%' }}
                            >
                                <iframe
                                    className="absolute top-0 left-0 w-full h-full rounded-lg shadow-lg"
                                    src={productVideoEmbedUrl}
                                    title="Product Video"
                                    frameBorder="0"
                                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                                    allowFullScreen
                                ></iframe>
                            </motion.div>
                        </div>
                    )}
                </div>

                {/* Product Details */}
                <div className="lg:pl-8">
                    <h1 className="text-4xl font-bold text-gray-900 mb-2">{product.productName}</h1>
                    <p className="text-lg text-gray-600 mb-4">{product.category}</p>

                    <div className="flex items-center space-x-4 mb-4">
                        <div className="flex items-baseline space-x-2">
                            {specialPriceValue && discountPercentage > 0 ? (
                                <>
                                    <span className="text-3xl font-bold text-blue-600">৳{specialPriceValue.toFixed(2)}</span>
                                    <span className="text-lg text-gray-500 line-through">৳{priceValue.toFixed(2)}</span>
                                    <span className="ml-2 px-2 py-1 bg-red-500 text-white text-sm font-semibold rounded">
                                        -{discountPercentage}%
                                    </span>
                                </>
                            ) : (
                                <span className="text-3xl font-bold text-gray-800">৳{priceValue.toFixed(2)}</span>
                            )}
                        </div>
                        <div className="flex items-center text-yellow-500 text-lg">
                            <FaStar className="mr-1" /> {avgRatingValue?.toFixed(1) || 'N/A'} ({reviewCountValue || 0} reviews)
                        </div>
                    </div>

                    <p className="text-gray-700 leading-relaxed mb-6">{product.description}</p>

                    {/* Dynamic Price Display */}
                    <div className="mb-4">
                        <span className="text-2xl font-bold text-gray-800">Total Price: ৳{totalPrice.toFixed(2)}</span>
                    </div>

                    {/* Variant Selection */}
                    {product.variants && product.variants.length > 0 && (
                        <div className="mb-6">
                            <h3 className="text-xl font-semibold text-gray-800 mb-3">Select Variant:</h3>
                            <div className="flex flex-wrap gap-3">
                                {product.variants.map((variant, index) => (
                                    <motion.button
                                        key={index}
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                                            selectedVariant === variant ? 'bg-blue-500 text-white' : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                        }`}
                                        onClick={() => handleVariantSelect(variant)}
                                        aria-label={`Select ${variant.color} variant`}
                                    >
                                        {variant.color}
                                        {variant.variantPrice ? ` (৳${parseNumber(variant.variantPrice).toFixed(2)})` : ''}
                                    </motion.button>
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Quantity Selector */}
                    <div className="flex items-center space-x-4 mb-6">
                        <div className="flex items-center space-x-2">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn btn-outline btn-sm"
                                onClick={decrementQuantity}
                                disabled={quantity <= 1}
                                aria-label="Decrease quantity"
                            >
                                <FaMinus />
                            </motion.button>
                            <input
                                type="number"
                                value={quantity}
                                onChange={handleQuantityChange}
                                min="1"
                                max={stockValue}
                                className="input input-bordered w-20 text-center"
                                aria-label="Quantity"
                            />
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                whileTap={{ scale: 0.95 }}
                                className="btn btn-outline btn-sm"
                                onClick={incrementQuantity}
                                disabled={quantity >= stockValue}
                                aria-label="Increase quantity"
                            >
                                <FaPlus />
                            </motion.button>
                        </div>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-primary text-white text-lg flex-1"
                            onClick={() => addToCartMutation.mutate()}
                            disabled={addToCartMutation.isLoading || stockValue === 0}
                            aria-label="Add to cart"
                        >
                            <FaCartPlus className="mr-2" /> {addToCartMutation.isLoading ? 'Adding...' : 'Add to Cart'}
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-success text-white text-lg flex-1"
                            onClick={() => navigate('/checkout', { state: { product, quantity, selectedVariant } })}
                            disabled={stockValue === 0}
                            aria-label="Buy now"
                        >
                            Buy Now
                        </motion.button>
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="btn btn-outline btn-secondary text-lg"
                            onClick={() => addToWishlistMutation.mutate()}
                            disabled={addToWishlistMutation.isLoading}
                            aria-label="Add to wishlist"
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
                            <li><strong>Available Stock:</strong> {stockValue} units</li>
                        </ul>
                    </div>

                    <div className="border-t pt-6 mt-6">
                        <h3 className="text-xl font-semibold text-gray-800 mb-3">Shipping & Warranty:</h3>
                        <ul className="text-gray-700 space-y-2">
                            {product.shippingInfo?.weight && (
                                <li><FaShippingFast className="inline mr-2" /> <strong>Weight:</strong> {parseNumber(product.shippingInfo.weight)} kg</li>
                            )}
                            {product.shippingInfo?.length && product.shippingInfo?.width && product.shippingInfo?.height && (
                                <li><FaRulerCombined className="inline mr-2" /> <strong>Dimensions:</strong> {parseNumber(product.shippingInfo.length)}L x {parseNumber(product.shippingInfo.width)}W x {parseNumber(product.shippingInfo.height)}H cm</li>
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

            {/* Reviews Section */}
            <div className="mt-12">
                <h3 className="text-2xl font-semibold text-gray-800 mb-6">Customer Reviews</h3>
                {reviews.length > 0 ? (
                    <div className="space-y-6">
                        {reviews.map((review, index) => (
                            <div key={index} className="border-b pb-4">
                                <div className="flex items-center mb-2">
                                    <FaStar className="text-yellow-500 mr-1" />
                                    <span>{review.rating.toFixed(1)}</span>
                                    <span className="ml-2 text-gray-600">{review.userName}</span>
                                </div>
                                <p className="text-gray-700">{review.comment}</p>
                                <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</p>
                            </div>
                        ))}
                    </div>
                ) : (
                    <p className="text-gray-600">No reviews yet. Be the first to review this product!</p>
                )}
                <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="btn btn-outline mt-4"
                    onClick={() => navigate(`/product/${id}/review`)}
                    aria-label="Write a review"
                >
                    Write a Review
                </motion.button>
            </div>

            {/* Related Products */}
            {relatedProducts.length > 0 && (
                <div className="mt-12">
                    <h3 className="text-2xl font-semibold text-gray-800 mb-6">Related Products</h3>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {relatedProducts.map((related) => (
                            <motion.div
                                key={related._id}
                                initial={{ opacity: 0, scale: 0.9 }}
                                animate={{ opacity: 1, scale: 1 }}
                                transition={{ duration: 0.3 }}
                                className="border rounded-lg p-4 hover:shadow-lg transition-shadow cursor-pointer"
                                onClick={() => navigate(`/product/${related._id}`)}
                                role="button"
                                aria-label={`View ${related.productName}`}
                            >
                                <img
                                    src={related.images?.[0]?.url || 'https://via.placeholder.com/150?text=Image+Not+Available'}
                                    alt={related.productName}
                                    className="w-full h-40 object-cover rounded-md mb-4"
                                    onError={(e) => {
                                        console.error("Related product image failed to load:", e.target.src);
                                        e.target.src = 'https://via.placeholder.com/150?text=Image+Not+Available';
                                    }}
                                />
                                <h4 className="text-lg font-semibold text-gray-800">{related.productName}</h4>
                                <p className="text-gray-600">{related.category}</p>
                                <p className="text-blue-600 font-bold">৳{parseNumber(related.price).toFixed(2)}</p>
                            </motion.div>
                        ))}
                    </div>
                </div>
            )}

            {/* Image Modal/Lightbox */}
            <AnimatePresence>
                {isImageModalOpen && mainImage?.url && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black bg-opacity-80 flex items-center justify-center z-50 p-4"
                        onClick={() => setIsImageModalOpen(false)}
                        role="dialog"
                        aria-label="Image lightbox"
                    >
                        <motion.img
                            initial={{ scale: 0.8 }}
                            animate={{ scale: 1 }}
                            exit={{ scale: 0.8 }}
                            transition={{ duration: 0.3 }}
                            src={mainImage.url}
                            alt="Zoomed Product Image"
                            className="max-w-full max-h-full object-contain bg-white"
                            onClick={(e) => e.stopPropagation()}
                            onError={(e) => {
                                console.error("Modal image failed to load:", e.target.src);
                                e.target.src = 'https://via.placeholder.com/600x400?text=Image+Not+Available';
                            }}
                        />
                        <button
                            className="absolute top-4 right-4 text-white text-3xl p-2 rounded-full bg-gray-700 bg-opacity-50 hover:bg-opacity-75 transition-colors"
                            onClick={() => setIsImageModalOpen(false)}
                            aria-label="Close image lightbox"
                        >
                            <FaTimes />
                        </button>
                    </motion.div>
                )}
            </AnimatePresence>
        </motion.div>
    );
};

export default ProductDetails;