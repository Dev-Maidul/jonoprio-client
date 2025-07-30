import React, { useState, useEffect, useRef, useContext } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { motion, AnimatePresence } from 'framer-motion';
import { FaStar, FaShippingFast, FaShieldAlt, FaBoxOpen, FaRulerCombined, FaCartPlus, FaHeart, FaTimes, FaPlayCircle, FaEye, FaPlus, FaMinus } from 'react-icons/fa';
import { toast } from 'react-toastify';
import Skeleton from 'react-loading-skeleton';
import 'react-loading-skeleton/dist/skeleton.css';

// Swiper modules and components
import { Swiper, SwiperSlide } from 'swiper/react';
import { FreeMode, Navigation, Thumbs, Pagination, A11y } from 'swiper/modules'; 

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/free-mode';
import 'swiper/css/navigation';
import 'swiper/css/thumbs';
import 'swiper/css/pagination';

// Import ReviewModal

import { AuthContext } from '../../Context/AuthProvider';
import ReviewModal from './ReviewModal';

const BASE64_FALLBACK_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAADAAAAAwCAYAAABXAvmHAAAAAXRSTlMAQObYZgAAAFpJUVORK5CYII='; // Base64 fallback

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const axiosSecure = useAxiosSecure();
  const { user } = useContext(AuthContext);
  const queryClient = useQueryClient();

  const [thumbsSwiper, setThumbsSwiper] = useState(null);
  const [mainImage, setMainImage] = useState(null); 
  const [isImageModalOpen, setIsImageModalOpen] = useState(false);
  const [showReviewModal, setShowReviewModal] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const [totalPrice, setTotalPrice] = useState(0);
  const [selectedVariant, setSelectedVariant] = useState(null);
  // reviews state is now productReviews from useQuery
  // const [reviews, setReviews] = useState([]); 

  // Fetch product details
  const { data: product, isLoading, isError, error, refetch: refetchProductDetails } = useQuery({
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
        } else {
          setMainImage({ url: BASE64_FALLBACK_IMAGE });
        }
      } else {
        setMainImage({ url: BASE64_FALLBACK_IMAGE });
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
  const { data: productReviews = [], refetch: refetchProductReviews } = useQuery({
    queryKey: ['productReviews', id],
    queryFn: async () => {
      const { data } = await axiosSecure.get(`/reviews/${id}`);
      return data;
    },
    enabled: !!id,
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
    if (typeof value === 'object' && value !== null && (value?.$numberInt !== undefined || value?.$numberDouble !== undefined)) {
      return parseFloat(value.$numberInt || value.$numberDouble);
    }
    return parseFloat(value) || 0;
  };
  const parseIntValue = (value) => {
    if (typeof value === 'object' && value !== null && (value?.$numberInt !== undefined || value?.$numberDouble !== undefined)) {
      return parseInt(value.$numberInt || value.$numberDouble);
    }
    return parseInt(value) || 0;
  };

  const priceValue = selectedVariant?.variantPrice ? parseNumber(selectedVariant.variantPrice) : (product ? parseNumber(product.price) : 0);
  const specialPriceValue = product ? parseNumber(product.specialPrice) : 0;
  const avgRatingValue = product ? parseNumber(product.avgRating) : 0;
  const reviewCountValue = product ? parseIntValue(product.reviewCount) : 0;
  const stockValue = selectedVariant?.variantStock ? parseIntValue(selectedVariant.variantStock) : (product ? parseIntValue(product.stock) : 0);

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
    // FIXED: Corrected template literal for YouTube embed URL
    return match && match[1] ? `http://www.youtube.com/embed/${match[1]}?autoplay=0&rel=0` : null; 
  };

  const productVideoEmbedUrl = getYouTubeEmbedUrl(product?.videoUrl);

  // Callback after successful review submission
  const handleReviewSuccess = () => {
    queryClient.invalidateQueries({ queryKey: ['productDetails', id] }); // Re-fetch product details to update avgRating and reviewCount
    queryClient.invalidateQueries({ queryKey: ['productReviews', id] }); // Re-fetch reviews to update the list
    toast.success("Thank you for your review!");
  };


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
        {/* Product Images Slider */}
        <div className="flex flex-col items-center">
            <div className="w-full max-w-lg mb-4">
                <Swiper
                    style={{
                        '--swiper-navigation-color': '#000',
                        '--swiper-pagination-color': '#000',
                    }}
                    loop={true}
                    spaceBetween={10}
                    navigation={true}
                    thumbs={{ swiper: thumbsSwiper }}
                    modules={[FreeMode, Navigation, Thumbs, Pagination, A11y]}
                    className="mySwiper2 rounded-lg shadow-lg"
                    pagination={{ clickable: true }}
                    effect="fade"
                    onClick={() => setIsImageModalOpen(true)}
                    role="button"
                    aria-label="Product image slider"
                >
                    {product.images?.length > 0 ? (
                        product.images.map((img, index) => (
                            <SwiperSlide key={img.public_id || index}>
                                <img
                                    src={img.url || BASE64_FALLBACK_IMAGE}
                                    alt={`${product.productName || 'Product Image'} ${index + 1}`}
                                    className="w-full h-96 object-contain bg-white"
                                    onError={(e) => {
                                        console.error(`Main Swiper image ${img.url} failed to load, using fallback:`, e.target.src);
                                        e.target.src = BASE64_FALLBACK_IMAGE;
                                    }}
                                />
                            </SwiperSlide>
                        ))
                    ) : (
                        <SwiperSlide>
                            <img src={BASE64_FALLBACK_IMAGE} alt="No Images Available" className="w-full h-96 object-contain bg-white" />
                        </SwiperSlide>
                    )}
                </Swiper>
            </div>

            {/* Thumbnails Swiper */}
            <div className="w-full max-w-lg">
                <Swiper
                    onSwiper={setThumbsSwiper}
                    loop={true}
                    spaceBetween={10}
                    slidesPerView={4}
                    freeMode={true}
                    watchSlidesProgress={true}
                    modules={[FreeMode, Navigation, Thumbs]}
                    className="mySwiper"
                >
                    {product.images?.length > 0 ? (
                        product.images.map((img, index) => (
                            <SwiperSlide key={img.public_id || index}>
                                <img
                                    src={img.url || BASE64_FALLBACK_IMAGE}
                                    alt={`Thumbnail ${index + 1}`}
                                    className="w-full h-20 object-cover rounded-md cursor-pointer"
                                    onError={(e) => {
                                        console.error(`Thumbnail Swiper image ${img.url} failed to load, using fallback:`, e.target.src);
                                        e.target.src = BASE64_FALLBACK_IMAGE;
                                    }}
                                />
                            </SwiperSlide>
                        ))
                    ) : (
                        <SwiperSlide>
                            <img src={BASE64_FALLBACK_IMAGE} alt="No Thumbnails" className="w-full h-20 object-cover rounded-md" />
                        </SwiperSlide>
                    )}
                </Swiper>
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
        {productReviews.length > 0 ? (
          <div className="space-y-6">
            {productReviews.map((review, index) => (
              <div key={index} className="border-b pb-4">
                <div className="flex items-center mb-2">
                  <FaStar className="text-yellow-500 mr-1" />
                  <span>{review.rating.toFixed(1)}</span>
                  <span className="ml-2 text-gray-600">{review.userName}</span>
                </div>
                <p className="text-gray-700">{review.comment}</p>
                {/* <p className="text-sm text-gray-500">{new Date(review.date).toLocaleDateString()}</p> */}
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
          onClick={() => setShowReviewModal(true)}
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
                  src={related.images?.[0]?.url || BASE64_FALLBACK_IMAGE}
                  alt={related.productName}
                  className="w-full h-40 object-cover rounded-md mb-4"
                  onError={(e) => {
                    console.error("Related product image failed to load:", e.target.src);
                    e.target.src = BASE64_FALLBACK_IMAGE;
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
                e.target.src = BASE64_FALLBACK_IMAGE;
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

      {/* Review Submission Modal */}
      <AnimatePresence>
        {showReviewModal && (
          <ReviewModal
            productId={id}
            onClose={() => setShowReviewModal(false)}
            onSuccessReview={handleReviewSuccess}
          />
        )}
      </AnimatePresence>
    </motion.div>
  );
};

export default ProductDetails;