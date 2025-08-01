import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PrivacyPolicy = () => {
  const cardVariants = {
    rest: { scale: 1, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.1)' },
    hover: { 
      scale: 1.03, 
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.15)', 
      transition: { duration: 0.3 }
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
      className="container mx-auto px-4 py-12 max-w-7xl my-10"
    >
      <h1 className="text-3xl md:text-4xl font-bold text-center text-yellow-300 mb-8 bg-gradient-to-r from-indigo-600 to-blue-500 text-transparent bg-clip-text">
        Privacy Policy for Jonoprio.com
      </h1>
      <p className="text-yellow-300 text-center mb-10 italic text-sm md:text-base">
        Last Updated: July 13, 2024
      </p>

      <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-4 gap-6">
        <motion.div
          variants={cardVariants}
          initial="rest"
          whileHover="hover"
          className="bg-white rounded-lg shadow-md p-6 cursor-pointer"
          style={cardBackgroundStyle}
        >
          <motion.section variants={sectionVariants} initial="hidden" animate="visible">
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Introduction</h2>
            <p className="text-gray-700 leading-relaxed">
              Welcome to <span className="font-semibold">Jonoprio.com</span>, an e-commerce platform based in Bangladesh. We are committed to safeguarding your privacy and protecting the personal information you share with us. This Privacy Policy explains how we collect, use, share, and protect your data when you visit our website or use our services.
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Information We Collect</h2>
            <p className="text-gray-600 mb-4">We collect information to enhance your experience and provide better services, including:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-3">
              <li>
                <span className="font-medium">Personal Information:</span> Name, email, and address during account creation; first name, last name, phone number, email, division, city, area, address 1, and address 2 when updating your address.
              </li>
              <li>
                <span className="font-medium">Transaction Information:</span> Product name, quantity, price, and delivery address for purchases.
              </li>
              <li>
                <span className="font-medium">Payment Information:</span> Credit/debit card details, billing address, and payment method for order processing.
              </li>
              <li>
                <span className="font-medium">Technical Information:</span> Device, browser, IP address, and browsing behavior to improve functionality.
              </li>
            </ul>
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">How We Use Your Information</h2>
            <p className="text-gray-600 mb-4">We use your information to provide and improve our services, including:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-3">
              <li>
                <span className="font-medium">Providing Services:</span> Process and deliver orders, manage accounts, and offer customer support.
              </li>
              <li>
                <span className="font-medium">Improving Our Services:</span> Analyze user interactions to enhance website functionality.
              </li>
              <li>
                <span className="font-medium">Communicating with You:</span> Send order updates, promotional offers, and relevant communications.
              </li>
              <li>
                <span className="font-medium">Security and Fraud Prevention:</span> Protect users and the platform from fraud and security threats.
              </li>
            </ul>
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Sharing Your Information</h2>
            <p className="text-gray-600 mb-4">We only share your information in specific cases:</p>
            <ul className="list-disc list-inside text-gray-700 space-y-3">
              <li>
                <span className="font-medium">With Service Providers:</span> Trusted third-party providers for payment processing, order fulfillment, and delivery.
              </li>
              <li>
                <span className="font-medium">For Legal Reasons:</span> Disclosure if required by law or to protect Jonoprio.com’s rights, property, or safety.
              </li>
            </ul>
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Data Security</h2>
            <p className="text-gray-600">
              We implement robust security measures to protect your personal information from unauthorized access, disclosure, alteration, or destruction. However, no method of transmission over the Internet or electronic storage is completely secure. We strive to use commercially acceptable means to safeguard your data.
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Your Rights</h2>
            <p className="text-gray-600">
              You have the right to access, update, or delete your personal information. Manage your data by logging into your account or contact our customer support team for assistance.
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Cookies</h2>
            <p className="text-gray-600">
              We use cookies to enhance your browsing experience. Cookies are small files stored on your device to remember preferences and improve functionality. Manage cookie preferences through your browser settings.
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Changes to This Privacy Policy</h2>
            <p className="text-gray-600">
              We may update this Privacy Policy periodically to reflect changes in practices or legal requirements. Updates will be posted here with a revised effective date. Review this policy regularly to stay informed.
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">Contact Us</h2>
            <p className="text-gray-600 mb-4">For questions or concerns about this Privacy Policy or our data practices, please reach out:</p>
            <div className="text-gray-700 space-y-3">
              <p><span className="font-medium">Jonoprio.com Customer Support</span></p>
              <p>
                <span className="font-medium">Email:</span>{' '}
                <motion.a
                  href="mailto:support@jonoprio.com"
                  className="text-indigo-600 hover:underline cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  support@jonoprio.com
                </motion.a>
              </p>
              <p>
                <span className="font-medium">Phone:</span>{' '}
                <motion.a
                  href="tel:+8801629810013"
                  className="text-indigo-600 hover:underline cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  01629810013
                </motion.a>
              </p>
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
          Thank you for choosing Jonoprio.com. We value your trust and are dedicated to protecting your privacy.
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
    </motion.div>
  );
};

export default PrivacyPolicy;