import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const PreorderTermCondition = () => {
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
        Jonoprio.com – অর্ডার এর অগ্রিম গ্রহণ এবং ডেলিভারি চার্জ সংক্রান্ত নিয়মাবলী
      </h1>
      <p className="text-yellow-300 text-center mb-10 italic text-sm md:text-base">
        Last Updated: August 01, 2025
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">১. অগ্রিম গ্রহণের পরিমাণ (ক্যাশ অন ডেলিভারি এবং কুরিয়ার কন্ডিশন)</h2>
            <p className="text-gray-700 leading-relaxed">
              যেকোনো পণ্যের অর্ডার গ্রহণের ক্ষেত্রে আগে ডেলিভারি চার্জ পরিশোধ করতে হবে।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">২. অগ্রিম গ্রহণের পরিমাণ (প্রি-অর্ডার)</h2>
            <p className="text-gray-700 leading-relaxed">
              যেকোনো পণ্যের প্রি-অর্ডার করার ক্ষেত্রে অগ্রিম গ্রহণের পরিমাণ পণ্য অনুযায়ী নির্ধারণ করা হবে।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">৩. প্রি-অর্ডারকৃত পণ্যের সরবরাহ সময়</h2>
            <p className="text-gray-700 leading-relaxed">
              সাধারণত প্রি-অর্ডারকৃত পণ্য সরবরাহ করতে আমাদের ৭-১০ কর্মদিবস সময় লাগে। কিছু ক্ষেত্রে, ১৫-২০ কিংবা তারও বেশি কর্মদিবস পর্যন্ত সময় লাগতে পারে।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">৪. আন্তর্জাতিক বাজারে মূল্য পরিবর্তন</h2>
            <p className="text-gray-700 leading-relaxed">
              আন্তর্জাতিক বাজারে পণ্যের মূল্য পরিবর্তিত হতে পারে, সেক্ষেত্রে প্রি-অর্ডারকৃত পণ্যের সাথে অতিরিক্ত মূল্য যোগ করতে হবে অথবা অগ্রিম প্রদানকৃত মূল্য ফেরত নেওয়া যাবে।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">৫. ডেলিভারি চার্জ নির্ধারণ</h2>
            <p className="text-gray-700 leading-relaxed">
              ঢাকা সিটির ভিতরে এবং বাহিরে বা দেশের যেকোন জায়গায় ডেলিভারির ক্ষেত্রে আলোচনা সাপেক্ষে কুরিয়ারের সার্ভিস চার্জ অনুযায়ী ডেলিভারি চার্জ নির্ধারণ করা হবে।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">৬. পার্সিয়াল পেমেন্ট এবং ডেলিভারি চার্জ</h2>
            <p className="text-gray-700 leading-relaxed">
              যেকোনো এক্সেসরিজের জন্য যদি পার্সিয়াল পেমেন্ট করা হয় সেক্ষেত্রে ডেলিভারি চার্জ এবং ক্ষেত্র বিশেষে এর সাথে কন্ডিশন চার্জ প্রযোজ্য হবে কুরিয়ার কোম্পানির নিয়ম অনুযায়ী।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">৭. অর্ডার প্লেসমেন্ট সময়</h2>
            <p className="text-gray-700 leading-relaxed">
              যেকোনো পণ্যের অর্ডার অবশ্যই বিকাল ৫.০০টার মধ্যে প্লেস করতে হবে। বিকাল ৫.০০টার পর কোনো পণ্যের অর্ডার পরবর্তী দিনের অর্ডার হিসেবে গণ্য করা হবে।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">৮. ডেলিভারি সময়সূচী (বাংলাদেশের নিয়ম অনুযায়ী)</h2>
            <p className="text-gray-700 leading-relaxed">
              সাধারণত ঢাকা সিটির মধ্যে ডেলিভারি ২-৩ কর্মদিবসের মধ্যে সম্পন্ন করা হয়। ঢাকার বাইরে ৫-৭ কর্মদিবস সময় লাগতে পারে, তবে এটি নির্ভর করে স্থানীয় কুরিয়ার পরিষেবার উপর।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">বি:দ্র:</h2>
            <p className="text-gray-700 leading-relaxed">
              এই নিয়মাবলী শুধুমাত্র সাময়িক সময়ের জন্য প্রযোজ্য এবং পরিস্থিতির পরিবর্তনের সাথে সাথে তা সংশোধিত হতে পারে।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">যোগাযোগ</h2>
            <p className="text-gray-600 mb-4">
              এই অর্ডার এর অগ্রিম গ্রহণ এবং ডেলিভারি চার্জ সংক্রান্ত নিয়মাবলী বা আমাদের পরিষেবা সম্পর্কে কোনো প্রশ্ন বা উদ্বেগ থাকলে আমাদের সাথে যোগাযোগ করুন:
            </p>
            <div className="text-gray-700 space-y-3">
              <p><span className="font-medium">Jonoprio.com কাস্টমার সাপোর্ট</span></p>
              <p>
                <span className="font-medium">ইমেইল:</span>{' '}
                <motion.a
                  href="mailto:jonoprio44@gmail.com"
                  className="text-indigo-600 hover:underline cursor-pointer"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  jonoprio44@gmail.com
                </motion.a>
              </p>
              <p>
                <span className="font-medium">ফোন:</span>{' '}
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
          Jonoprio.com-এ আপনার আস্থার জন্য ধন্যবাদ। আমরা আপনার সন্তুষ্টি এবং বিশ্বাসের মূল্য দিই।
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

export default PreorderTermCondition;