import React, { useContext } from 'react';
import { motion } from 'framer-motion';
import { useQuery } from '@tanstack/react-query';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import ProductsCard from './ProductsCard';


const AllProducts = () => {
    const axiosSecure = useAxiosSecure(); // Public route, but using axiosSecure is fine

    // Fetch all products
    const { data: products, isLoading, isError, error } = useQuery({
        queryKey: ['allProducts'],
        queryFn: async () => {
            const { data } = await axiosSecure.get('/products'); // Backend API endpoint
            return data;
        },
        // For public routes, no 'user?.email' dependency needed
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

    if (!products || products.length === 0) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                No products found.
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5 }}
            className="container mx-auto px-4 py-8"
        >
            <h1 className="text-4xl font-bold text-yellow-300 text-center mb-10">Our Products</h1>
            
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
                {products.map(product => (
                    <ProductsCard key={product._id} product={product} />
                ))}
            </div>
        </motion.div>
    );
};

export default AllProducts;