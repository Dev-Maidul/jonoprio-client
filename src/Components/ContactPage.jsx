import React from "react";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";

const ContactPage = () => {
  const cardVariants = {
    rest: { scale: 1, boxShadow: "0 4px 6px -1px rgba(0, 0, 0, 0.1)" },
    hover: {
      scale: 1.03,
      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.15)",
      transition: { duration: 0.3 },
    },
  };

  const sectionVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
  };

  const cardBackgroundStyle = {
    backgroundImage: `
      linear-gradient(to right, #f0f0f0 1px, transparent 1px),
      linear-gradient(to bottom, #f0f0f0 1px, transparent 1px),
      radial-gradient(circle 800px at 0% 200px, #d5c5ff, transparent)
    `,
    backgroundSize: "96px 64px, 96px 64px, 100% 100%",
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen w-full py-12 px-4"
    >
      <div className="container mx-auto max-w-6xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-yellow-300 mb-8 bg-gradient-to-r from-indigo-600 to-blue-500 text-transparent bg-clip-text">
          Contact Us
        </h1>

        <motion.div
          variants={cardVariants}
          initial="rest"
          whileHover="hover"
          className="bg-white rounded-lg shadow-md p-8 max-w-2xl mx-auto cursor-pointer"
          style={cardBackgroundStyle}
        >
          <motion.div
            variants={sectionVariants}
            initial="hidden"
            animate="visible"
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-gray-800 mb-6 text-center">
              Get in Touch
            </h2>
            <p className="text-gray-600 mb-6 text-center">
              Feel free to reach out to us through the following methods. We're
              here to assist you!
            </p>
            <div className="text-gray-700 space-y-6">
              <div className="flex items-center justify-center">
                <span className="text-indigo-600 font-medium mr-3">Phone:</span>
                <motion.a
                  href="tel:+8801629810013"
                  className="text-lg text-indigo-600 hover:underline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Call Jonoprio customer support at +8801629810013"
                >
                  01629810013
                </motion.a>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-indigo-600 font-medium mr-3">Email:</span>
                <motion.a
                  href="mailto:jonoprio44@gmail.com"
                  className="text-lg text-indigo-600 hover:underline"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  aria-label="Email Jonoprio customer support at support@jonoprio.com"
                >
                  jonoprio44@gmail.com
                </motion.a>
              </div>
              <div className="flex items-center justify-center">
                <span className="text-indigo-600 font-medium mr-3">
                  Address:
                </span>
                <span className="text-lg">
                  Mirpur 2,Kataltola(Online Store) Dhaka, Bangladesh
                </span>
              </div>
            </div>
          </motion.div>
        </motion.div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="text-center mt-10"
        >
          <p className="text-yellow-300 mb-6">
            Thank you for choosing Jonoprio.com. We value your trust and
            satisfaction.
          </p>
          <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
            <Link
              to="/"
              className="inline-block bg-gradient-to-r from-purple-600 to-pink-500 text-white px-8 py-3 rounded-lg shadow-md hover:from-purple-700 hover:to-pink-600 transition-all duration-300 cursor-pointer"
            >
              Back to Home
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </motion.div>
  );
};

export default ContactPage;
