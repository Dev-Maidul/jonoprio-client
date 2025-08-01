import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Link } from 'react-router-dom';

const FaqPage = () => {
  const [openIndex, setOpenIndex] = useState(null);

  const toggleAccordion = (index) => {
    setOpenIndex(openIndex === index ? null : index);
  };

  const faqs = [
    {
      question: '1. How do I place an order on Jonoprio.com?',
      answer:
        'To place an order on Jonoprio.com, simply browse through our product catalog, add your desired products to the cart, and proceed to checkout. You’ll be asked to provide shipping details and select a payment method before confirming your order.',
    },
    {
      question: '2. What payment methods do you accept?',
      answer:
        'We accept multiple payment methods, including credit/debit cards, mobile banking, and cash on delivery (COD) in select regions. You can choose your preferred payment method during checkout.',
    },
    {
      question: '3. Can I track my order?',
      answer:
        'Yes! Once your order is shipped, we will send you a tracking number via email or SMS. You can use this tracking number to monitor your package’s delivery status in real-time.',
    },
    {
      question: '4. How long does shipping take?',
      answer:
        'Shipping times vary based on your location. In general, orders are delivered within 3-7 business days. For international shipments, delivery might take 7-14 business days depending on the destination country.',
    },
    {
      question: '5. Can I return or exchange a product?',
      answer:
        'Yes, we accept returns and exchanges for most products within 14 days of delivery. Please ensure that the product is in its original condition, with all packaging intact. For further assistance, contact our customer support team.',
    },
    {
      question: '6. How can I contact customer support?',
      answer:
        'You can contact our customer support team by emailing us at <span class="font-semibold">support@jonoprio.com</span> or by calling us at <span class="font-semibold">01629810013</span>. We’re available from 9 AM to 6 PM, Monday to Saturday.',
    },
    {
      question: '7. Do you offer warranty on products?',
      answer:
        'Yes, we provide warranty on select products. Please check the product description or the warranty policy for more details about specific items.',
    },
    {
      question: '8. How do I apply a discount code?',
      answer:
        'To apply a discount code, enter the code in the "Promo Code" field during checkout. The discount will be applied automatically to your total order amount if the code is valid.',
    },
    {
      question: '9. Is my personal information secure?',
      answer:
        'Yes, we take your privacy and security seriously. We use industry-standard encryption protocols to protect your personal and payment information. You can read more about our privacy practices in our Privacy Policy.',
    },
    {
      question: '10. Can I cancel or modify my order after placing it?',
      answer:
        'Once an order is placed, it is processed immediately for quick delivery. If you need to cancel or modify your order, please contact customer support as soon as possible. We may be able to accommodate changes before shipment, but we cannot guarantee it.',
    },
  ];

  const accordionVariants = {
    open: { height: 'auto', opacity: 1, marginTop: 16, transition: { duration: 0.3 } },
    closed: { height: 0, opacity: 0, marginTop: 0, transition: { duration: 0.3 } },
  };

  const cardVariants = {
    rest: { scale: 1, boxShadow: '0 4px 6px -1px rgba(0, 0, 0, 0.3)' },
    hover: {
      scale: 1.02,
      boxShadow: '0 10px 15px -3px rgba(0, 0, 0, 0.4)',
      transition: { duration: 0.3 },
    },
  };

  return (
    <div className="min-h-screen w-full  relative">
      <div
        className="absolute inset-0 z-0"
        
      />
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.6 }}
        className="relative container mx-auto px-4 py-12 max-w-6xl z-10"
      >
        <h1 className="text-3xl md:text-4xl font-bold text-center text-white mb-8 bg-gradient-to-r from-purple-400 to-pink-400 text-transparent bg-clip-text">
          Frequently Asked Questions (FAQ)
        </h1>
       

        <div className="space-y-4">
          {faqs.map((faq, index) => (
            <motion.div
              key={index}
              variants={cardVariants}
              initial="rest"
              whileHover="hover"
              className="bg-[#1e293b] rounded-lg shadow-lg overflow-hidden"
            >
              <button
                className="w-full text-left p-6 flex justify-between items-center cursor-pointer"
                onClick={() => toggleAccordion(index)}
                aria-expanded={openIndex === index}
                aria-controls={`faq-answer-${index}`}
              >
                <h2 className="text-xl md:text-2xl font-semibold text-yellow-300">{faq.question}</h2>
                <motion.span
                  animate={{ rotate: openIndex === index ? 180 : 0 }}
                  transition={{ duration: 0.3 }}
                  className="text-yellow-300"
                >
                  {openIndex === index ? '▲' : '▼'}
                </motion.span>
              </button>
              <AnimatePresence>
                {openIndex === index && (
                  <motion.div
                    id={`faq-answer-${index}`}
                    variants={accordionVariants}
                    initial="closed"
                    animate="open"
                    exit="closed"
                    className="px-6 pb-6 text-gray-300 overflow-hidden"
                  >
                    <p dangerouslySetInnerHTML={{ __html: faq.answer }} />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          ))}
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center mt-10"
        >
          <p className="text-gray-400 mb-6">
            For additional queries, feel free to reach out to our support team.
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
    </div>
  );
};

export default FaqPage;