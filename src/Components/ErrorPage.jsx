// src/Components/ErrorPage.jsx
import React from 'react';
import { Link } from 'react-router-dom';
import { motion } from 'framer-motion';

const ErrorPage = () => {
  // Framer Motion variants for animation
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2, // Stagger animation for child elements
      },
    },
  };

  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6, ease: "easeOut" } },
  };

  return (
    <motion.div
      className="min-h-screen bg-site-bg flex flex-col items-center justify-center text-primary-text p-4 text-center"
      initial="hidden"
      animate="visible"
      variants={containerVariants}
    >
      <motion.h1
        className="text-6xl md:text-8xl lg:text-9xl font-extrabold text-secondary-accent mb-4 drop-shadow-md"
        variants={itemVariants}
      >
        404
      </motion.h1>
      <motion.h2
        className="text-2xl md:text-4xl font-bold mb-6"
        variants={itemVariants}
      >
        Page Not Found
      </motion.h2>
      <motion.p
        className="text-lg md:text-xl mb-8 max-w-xl"
        variants={itemVariants}
      >
        Oops! The property you're looking for doesn't seem to exist. It might have been sold,
        removed, or you might have typed the address incorrectly.
      </motion.p>
      <motion.div
        variants={itemVariants}
      >
         <Link
                        to="/"
                        className="relative inline-flex items-center justify-start px-6 py-3 overflow-hidden font-medium transition-all bg-red-500 rounded-xl group"
                      >
                        <span className="absolute top-0 right-0 inline-block w-4 h-4 transition-all duration-500 ease-in-out bg-red-700 rounded group-hover:-mr-4 group-hover:-mt-4">
                          <span className="absolute top-0 right-0 w-5 h-5 rotate-45 translate-x-1/2 -translate-y-1/2 bg-white"></span>
                        </span>
                        <span className="absolute bottom-0 left-0 w-full h-full transition-all duration-500 ease-in-out delay-200 -translate-x-full translate-y-full bg-red-600 rounded-2xl group-hover:mb-12 group-hover:translate-x-0"></span>
                        <span className="relative w-full text-left text-white transition-colors duration-200 ease-in-out group-hover:text-white">
                          Back to Home
                        </span>
                      </Link>
      </motion.div>
    </motion.div>
  );
};

export default ErrorPage;