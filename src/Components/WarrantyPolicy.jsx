import React from 'react';
import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';

const WarrantyPolicy = () => {
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
        Jonoprio.com – ওয়ারেন্টি পলিসি
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">১. ওয়ারেন্টি পলিসি</h2>
            <p className="text-gray-700 leading-relaxed">
              আমরা আন্তর্জাতিক, দেশীয় বা বাংলাদেশ ECAB এবং প্রতিটি প্রোডাক্টের জন্য নির্দিষ্ট ব্র্যান্ডের জারি করা ওয়ারেন্টি পলিসি অনুসরণ করি।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">২. প্রোডাক্ট চেক করা</h2>
            <p className="text-gray-700 leading-relaxed">
              কাস্টমারকে প্রোডাক্ট আনবক্স করার আগে রঙ, মডেল, স্পেসিফিকেশন এবং আকার ভালোভাবে পরীক্ষা করতে হবে।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">৩. প্রোডাক্ট পরিবর্তন</h2>
            <p className="text-gray-700 leading-relaxed">
              কাস্টমার যদি আসল প্রোডাক্টটি পরিবর্তন করতে চান তবে আপগ্রেড করার সময় যে কোনো ক্ষতি হলে তা সম্পূর্ণ তার দায়িত্ব।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">৪. পেমেন্ট পরিশোধ</h2>
            <p className="text-gray-700 leading-relaxed">
              যেকোনো প্রোডাক্ট আনবক্স করার আগে, কাস্টমারকে চুক্তিকৃত মূল্য পরিশোধ করতে হবে। মনে রাখবেন, আনবক্স করার পর ডিল বাতিল করার কোনো বিকল্প নেই। কাস্টমার যদি অর্ডার বাতিল করতে চান তবে তাকে প্রোডাক্টের মূল্যের ২০% পরিশোধ করতে হবে।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">৫. ওয়ারেন্টি মেরামত</h2>
            <p className="text-gray-700 leading-relaxed">
              ওয়ারেন্টি দ্বারা আচ্ছাদিত প্রোডাক্ট বিক্রির পরে কোনো ত্রুটি পাওয়া গেলে, ত্রুটি মেরামতের মাধ্যমে সরানো হয় এবং প্রোডাক্টের ধরন অনুযায়ী তা অবিলম্বে পরিবর্তন করা হয়।
            </p>
            <p className="text-gray-700 leading-relaxed mt-4">
              এছাড়াও, একটি নির্দিষ্ট মডেলের প্রোডাক্ট যদি মেরামতযোগ্য না হয় এবং আমাদের স্টকে একই বা সমতুল্য প্রোডাক্ট না থাকে তবে অবচয় এবং মূল্য সামঞ্জস্যের মাধ্যমে একটি ভাল প্রোডাক্ট প্রতিস্থাপন করা যেতে পারে।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">৬. ওয়ারেন্টি নয় এমন প্রোডাক্ট</h2>
            <p className="text-gray-700 leading-relaxed">
              সমস্ত প্রোডাক্ট ওয়ারেন্টি সহ আসে না। ওয়ারেন্টি শুধুমাত্র সেই প্রোডাক্টগুলির জন্য বৈধ যা একটি নির্দিষ্ট সময়ের জন্য ওয়ারেন্টি সহ ক্রয় করা হয়েছে, বিল বা ইনভয়েসে উল্লিখিত অনুযায়ী।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">৭. সফটওয়্যার বা ডেটা ক্ষতি</h2>
            <p className="text-gray-700 leading-relaxed">
              যদি প্রোডাক্টের ব্যবহার বা Jonoprio.com এর পরিষেবা চলাকালীন কোনো সফটওয়্যার বা ডেটা ক্ষতিগ্রস্ত বা হারিয়ে যায় তবে Jonoprio.com এর কোনো দায় থাকবে না। মনে রাখবেন, এই ক্ষেত্রে, Jonoprio.com ডেটা পুনরুদ্ধার বা সফটওয়্যার পুনরুদ্ধারের জন্যও দায়ী নয়।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">৮. সার্ভিস টাইম</h2>
            <p className="text-gray-700 leading-relaxed">
              সার্ভিস কাজ সম্পন্ন করার পরে প্রোডাক্ট ফেরত দেওয়ার জন্য কোনো নির্দিষ্ট সময় নেই। ওয়ারেন্টির আওতায় নির্দিষ্ট মডেলের প্রোডাক্টের জন্য, এই সময়টি ৫-৬ দিন থেকে সর্বাধিক ৩৫-৪০ দিন বা তার বেশি হতে পারে।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">৯. ফ্লাইট/রাজনৈতিক অস্থিরতা</h2>
            <p className="text-gray-700 leading-relaxed">
              যেমন: গ্লোবাল মহামারী বা যেকোনো রাজনৈতিক অস্থিরতা ইত্যাদি পরিস্থিতির জন্য যেখানে সমস্ত ফ্লাইট অনুমোদিত বা বন্ধ নেই এবং ওয়ারেন্টি শেষ হয়ে গেছে, Jonoprio.com কোনোভাবেই নিজ খরচে মেরামত করার দায়িত্ব নেবে, তবে প্রয়োজন হলে ২-৩ মাস সময় লাগবে।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">১০. মেরামত সংক্রান্ত তথ্য</h2>
            <p className="text-gray-700 leading-relaxed">
              গ্রাহকদের জানানো হয় যে বেশিরভাগ ওয়ারেন্টি প্রোডাক্ট মেরামত করা হয় না; ক্ষতিগ্রস্ত অংশগুলি প্রতিস্থাপিত হয়, তবে বেশিরভাগ ক্ষেত্রে বিদেশ থেকে আমদানি করা হয়।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">১১. কাস্টমাইজড ডিভাইস ও অপারেটিং সিস্টেম</h2>
            <p className="text-gray-700 leading-relaxed">
              বিক্রয়ের সময় কাস্টমাইজ করা ডিভাইস এবং অপারেটিং সিস্টেম ওয়ারেন্টির আওতায় পড়ে না।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">১২. পাসওয়ার্ড নিরাপত্তা</h2>
            <p className="text-gray-700 leading-relaxed">
              Jonoprio.com ডিভাইস বা অন্যান্য প্রোডাক্ট ডেলিভারির সময় কোনো ধরনের পাসওয়ার্ড বা সিকিউরিটি কোড প্রয়োগ করে না। কাস্টমারকে সমস্ত ধরনের পাসওয়ার্ডের সম্পূর্ণ দায়িত্ব নিতে হবে। এটি ওয়ারেন্টির আওতায় থাকবে না।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">১৩. ওয়ারেন্টি মেয়াদ</h2>
            <p className="text-gray-700 leading-relaxed">
              Jonoprio.com ওয়ারেন্টি মেয়াদ শেষ হওয়ার সময় বা পরে Jonoprio.com দ্বারা প্রদত্ত যেকোনো ফ্রি সফটওয়্যার বা হার্ডওয়্যার টিউনিংয়ের জন্য দায়ী থাকবে না।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">১৪. পরিষেবা চার্জ</h2>
            <p className="text-gray-700 leading-relaxed">
              Jonoprio.com ওয়ারেন্টির আওতায় না থাকা যেকোনো পরিষেবার জন্য কাস্টমারের সম্মতিতে চার্জ নির্ধারণ করবে।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">১৫. সিরিয়াল বা স্টিকার ক্ষতি</h2>
            <p className="text-gray-700 leading-relaxed">
              যদি প্রোডাক্টের সিরিয়াল/স্টিকার আংশিক বা সম্পূর্ণভাবে সরানো বা ক্ষতিগ্রস্ত হয় তবে আর ওয়ারেন্টি ক্লেইম করা যাবে না।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">১৬. স্থায়ী কালি বা ক্ষতি</h2>
            <p className="text-gray-700 leading-relaxed">
              যদি ব্যবহারকারী প্রোডাক্টের উপর স্থায়ী কালি দিয়ে কিছু লেখেন, তবে ওয়ারেন্টি বাতিল হয়ে যাবে।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">১৭. ক্যাবল ক্ষতি</h2>
            <p className="text-gray-700 leading-relaxed">
              প্রোডাক্টের সাথে প্রদত্ত ক্যাবলের কোনো ক্ষতি ওয়ারেন্টি দ্বারা আচ্ছাদিত নয়, এমনকি প্রোডাক্টের বৈধ ওয়ারেন্টি থাকলেও।
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
            <h2 className="text-xl md:text-2xl font-semibold text-gray-800 mb-4">১৮. রসিদ হারানো</h2>
            <p className="text-gray-700 leading-relaxed">
              যদি কোনো নির্দিষ্ট প্রোডাক্টের ওয়ারেন্টি রসিদ হারিয়ে যায়, তবে ক্রয়ের রসিদ এবং সঠিক প্রমাণ প্রদানের শর্তে প্রোডাক্ট গ্রহণ করতে হবে।
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
              এই ওয়ারেন্টি পলিসি বা আমাদের পরিষেবা সম্পর্কে কোনো প্রশ্ন বা উদ্বেগ থাকলে আমাদের সাথে যোগাযোগ করুন:
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

export default WarrantyPolicy;