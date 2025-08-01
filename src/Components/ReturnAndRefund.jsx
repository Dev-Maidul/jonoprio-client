import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const ReturnAndRefund = () => {
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
        Jonoprio.com – ডেলিভারি, রিটার্ন, এবং রিফান্ড নীতিমালা
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">ডেলিভারি পর ম্যানুফেকচারিং ত্রুটি</h2>
            <p className="text-gray-700 leading-relaxed">
              পণ্য ডেলিভারি পাওয়ার পর ২৪ ঘণ্টার মধ্যে আমাদের হটলাইনে ম্যানুফেকচারিং ত্রুটি জানাতে হবে।
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              ত্রুটিযুক্ত পণ্য আমাদের স্টোর থেকে পরিবর্তন করা যাবে। এক্ষেত্রে আমাদের এক্সপার্টগণ পণ্যে ত্রুটি পর্যবেক্ষণ করে তা পরিবর্তন করার পদক্ষেপ গ্রহণ করবেন।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">রিপ্লেসমেন্ট ও এক্সচেঞ্জ</h2>
            <p className="text-gray-700 leading-relaxed">
              প্রোডাক্ট রিসিভ করার দিন থেকে ৩ দিনের মধ্যে যদি কোনো সমস্যা দেখা দেয়, তাহলে গ্রাহক সম্পূর্ণ ফ্রি রিপ্লেসমেন্ট পাবেন অথবা এক্সচেঞ্জ করে অন্য যেকোনো পণ্য নিতে পারবেন।
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              অর্ডারকৃত পণ্য যদি স্টকে না থাকে এবং পরবর্তী ১০ দিনের মধ্যে পণ্য গ্রাহক না পেয়ে থাকেন, এই ক্ষেত্রে গ্রাহক সম্পূর্ণ টাকা ফেরত পাবেন।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">ডেলিভারি চার্জ</h2>
            <p className="text-gray-700 leading-relaxed">
              ৩ দিনের মধ্যে ইস্যু জানালে পণ্য গ্রাহক থেকে ফেরত এবং গ্রাহককে পাঠানোর ক্ষেত্রে ডেলিভারি চার্জ আমরা বহন করবো।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">পণ্য ফেরত ও রিফান্ড</h2>
            <p className="text-gray-700 leading-relaxed">
              পণ্য হাতে পাওয়ার পর যদি লাগবে না মনে হয়, ভুল ক্রমে অর্ডার করলে, বা একাধিক অর্ডার হয়ে গেলে গ্রাহক পণ্যটি ফেরত দিয়ে রিফান্ড অথবা অন্য যেকোনো কিছু নিতে পারবেন, তবে পণ্যটি অবশ্যই ইন্ট্যাক্ট থাকতে হবে।
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              বক্স খুললে বা ছিঁড়ে ফেললে কোনো প্রকার ক্লেইম করা হবে না, রিফান্ড বা এক্সচেঞ্জ করা হবে না।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">ওয়ারেন্টি</h2>
            <p className="text-gray-700 leading-relaxed">
              পণ্য পাওয়ার ৩ দিন পরের সকল প্রোডাক্টের ওয়ারেন্টি রেগুলার ওয়ারেন্টি হিসেবে গণ্য হবে এবং এই ক্ষেত্রে পণ্য অফিসে পাঠাতে এবং গ্রাহকের কাছে পাঠাতে ডেলিভারি চার্জ গ্রাহককে বহন করতে হবে।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">কুরিয়ার ইস্যু</h2>
            <p className="text-gray-700 leading-relaxed">
              পণ্য ভাঙ্গা থাকলে বা প্যাকেট ছেঁড়া থাকলে কুরিয়ার থেকে পণ্য রিসিভ করবেন না।
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              কুরিয়ারে ক্ষতিগ্রস্ত পণ্য রিসিভ করলে তা নিজ দায়িত্বে করতে হবে এবং পরে কোনো অভিযোগ গ্রহণযোগ্য হবে না।
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              রিসিভ করার পর মিসিং বা ড্যামেজ পাওয়া গেলে গ্রাহককে পার্সেল খোলার সময় ভিডিও ধারণ করতে হবে, অন্যথায় কোনো অভিযোগ গ্রহণযোগ্য হবে না।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">রিফান্ড সময়কাল</h2>
            <p className="text-gray-700 leading-relaxed">
              নির্দিষ্ট কারণে পণ্য রিটার্ন দিলে তার মূল্য রিফান্ড করতে ৩ থেকে ১০ কার্যদিবস লাগতে পারে, অনলাইন পেমেন্টের ক্ষেত্রে আরও বেশি সময় লাগতে পারে।
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              বিকাশ / অনলাইন / POS পেমেন্ট রিফান্ডের ক্ষেত্রে রিফান্ড চার্জ প্রযোজ্য।
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
              এই ডেলিভারি, রিটার্ন, এবং রিফান্ড নীতিমালা বা আমাদের পরিষেবা সম্পর্কে কোনো প্রশ্ন বা উদ্বেগ থাকলে আমাদের সাথে যোগাযোগ করুন:
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

export default ReturnAndRefund;