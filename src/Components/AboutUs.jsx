import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const AboutUs = () => {
  const cardVariants = {
    rest: { scale: 1, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
    hover: {
      scale: 1.03,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.15)',
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
    backgroundSize: '96px 64px, 96px 64px, 100% 100%',
  };

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.6 }}
      className="min-h-screen w-full py-12 px-4"
    >
      <div className="container mx-auto max-w-7xl">
        <h1 className="text-3xl md:text-4xl font-bold text-center text-yellow-300 mb-8 bg-gradient-to-r from-indigo-600 to-blue-500 text-transparent bg-clip-text">
          About Jonoprio.com
        </h1>


        <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
          <motion.div
            variants={cardVariants}
            initial="rest"
            whileHover="hover"
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer lg:col-span-4 md:col-span-3"
            style={cardBackgroundStyle}
          >
            <motion.section variants={sectionVariants} initial="hidden" animate="visible">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 text-center">
                Welcome to Jonoprio.com
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Welcome to Jonoprio.com, your premier online destination for the latest and greatest in sound equipment, smart electronics, computer accessories, and fashion bags. At Jonoprio.com, we are committed to bringing you top-quality products directly from trusted manufacturers in China, ensuring you receive the best value for your money. Our mission is to provide our customers in Bangladesh with an unparalleled shopping experience by offering a diverse range of products at competitive prices, backed by exceptional customer service and a hassle-free return policy.
              </p>
            </motion.section>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="rest"
            whileHover="hover"
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer"
            style={cardBackgroundStyle}
          >
            <motion.section variants={sectionVariants} initial="hidden" animate="visible">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                Wide Range of Products
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Whether you’re looking for the latest earphones, smartwatches, or stylish travel bags, we’ve got you covered. Our carefully curated selection ensures that you find exactly what you need.
              </p>
            </motion.section>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="rest"
            whileHover="hover"
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer"
            style={cardBackgroundStyle}
          >
            <motion.section variants={sectionVariants} initial="hidden" animate="visible">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                Quality Assurance
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We source our products directly from reputable manufacturers in China, ensuring that every item meets our high standards of quality and reliability.
              </p>
            </motion.section>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="rest"
            whileHover="hover"
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer"
            style={cardBackgroundStyle}
          >
            <motion.section variants={sectionVariants} initial="hidden" animate="visible">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                Customer-Centric Approach
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Your satisfaction is our top priority. We offer a seamless shopping experience, from easy navigation on our website to fast delivery and a comprehensive return and refund policy.
              </p>
            </motion.section>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="rest"
            whileHover="hover"
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer"
            style={cardBackgroundStyle}
          >
            <motion.section variants={sectionVariants} initial="hidden" animate="visible">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                Secure Shopping
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Your privacy and security are paramount to us. We use advanced encryption technologies to protect your personal information and ensure a safe shopping environment.
              </p>
            </motion.section>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="rest"
            whileHover="hover"
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer"
            style={cardBackgroundStyle}
          >
            <motion.section variants={sectionVariants} initial="hidden" animate="visible">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                100% Genuine Products
              </h2>
              <p className="text-gray-700 leading-relaxed">
                We never compromise on quality. We import directly from China and deliver to our customers without any imitation or assembly. Shop confidently with us, knowing you’re getting authentic products.
              </p>
            </motion.section>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="rest"
            whileHover="hover"
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer"
            style={cardBackgroundStyle}
          >
            <motion.section variants={sectionVariants} initial="hidden" animate="visible">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">
                100% Customer Satisfaction
              </h2>
              <p className="text-gray-700 leading-relaxed">
                Your satisfaction is our main priority. We believe in quality and honesty, which will undoubtedly achieve your satisfaction, Insha Allah.
              </p>
            </motion.section>
          </motion.div>

          <motion.div
            variants={cardVariants}
            initial="rest"
            whileHover="hover"
            className="bg-white rounded-lg shadow-md p-6 cursor-pointer lg:col-span-4 md:col-span-3"
            style={cardBackgroundStyle}
          >
            <motion.section variants={sectionVariants} initial="hidden" animate="visible">
              <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4 text-center">
                Contact Us
              </h2>
              <p className="text-gray-600 mb-6 text-center">
                Have questions or need assistance? Reach out to our team, and we’ll be happy to help!
              </p>
              <div className="text-gray-700 space-y-4">
                <div className="flex items-center justify-center">
                  <span className="text-indigo-600 font-medium mr-3">Phone:</span>
                  <motion.a
                    href="tel:+8801301949648"
                    className="text-lg text-indigo-600 hover:underline"
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    aria-label="Call Jonoprio customer support at +8801301949648"
                  >
                    01301949648
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
              </div>
            </motion.section>
          </motion.div>
        </div>

        <motion.div
          variants={sectionVariants}
          initial="hidden"
          animate="visible"
          className="text-center mt-10"
        >
          <p className="text-yellow-300 mb-6">
            Thank you for choosing Jonoprio.com. We value your trust and satisfaction.
          </p>
          <motion.div
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
          >
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

export default AboutUs;