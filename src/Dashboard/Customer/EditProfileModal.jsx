import React, { useState, useContext, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useForm } from 'react-hook-form';
import { AuthContext } from '../../Context/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { imageUpload } from '../../API/utilis';
import toast from 'react-hot-toast';
import { FaUserCircle, FaCamera, FaTimes } from 'react-icons/fa';
import { useMutation, useQueryClient } from '@tanstack/react-query';

const EditProfileModal = ({ user, userRole, onClose }) => {
  const { updateUserProfile, setUser } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();
  const { register, handleSubmit, formState: { errors }, reset } = useForm({
    defaultValues: {
      name: user?.displayName || '',
      email: user?.email || '',
      role: userRole,
    }
  });

  const [loading, setLoading] = useState(false);
  const [newImageFile, setNewImageFile] = useState(null);
  const [newImagePreview, setNewImagePreview] = useState(user?.photoURL || null);

  const updateProfileMutation = useMutation({
    mutationFn: async (updatedUserData) => {
        return await axiosSecure.put(`/user/${user.email}`, updatedUserData);
    },
    onSuccess: () => {
        // Invalidate queries to re-fetch user data and role if needed
        queryClient.invalidateQueries({ queryKey: ['userRole', user?.email] });
        toast.success("প্রোফাইল সফলভাবে আপডেট হয়েছে!");
        onClose();
    },
    onError: (error) => {
        console.error("Error updating profile:", error.response?.data || error.message);
        toast.error(error.response?.data?.message || "প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে।");
    },
  });

  const onSubmit = async (data) => {
    setLoading(true);
    let updatedPhotoURL = user?.photoURL;

    if (newImageFile) {
      try {
        const imageData = await imageUpload(newImageFile);
        updatedPhotoURL = imageData.url;
        toast.success("প্রোফাইল ছবি সফলভাবে আপলোড হয়েছে!");
      } catch (uploadError) {
        console.error("Profile picture upload failed:", uploadError);
        toast.error("প্রোফাইল ছবি আপলোড ব্যর্থ হয়েছে। আগের ছবি ব্যবহার করা হচ্ছে।");
        setLoading(false);
        return;
      }
    }
    
    try {
      await updateUserProfile(data.name, updatedPhotoURL);

      setUser({ ...user, displayName: data.name, photoURL: updatedPhotoURL });

      const updatedUserData = {
        name: data.name,
        image: updatedPhotoURL,
        last_loggedIn: new Date().toISOString(),
      };

      await updateProfileMutation.mutateAsync(updatedUserData);
      
    } catch (error) {
      console.error("Error updating profile:", error.response?.data || error.message);
      toast.error(error.response?.data?.message || "প্রোফাইল আপডেট করতে ব্যর্থ হয়েছে।");
    } finally {
      setLoading(false);
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setNewImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setNewImagePreview(reader.result);
      reader.readAsDataURL(file);
    } else {
      setNewImagePreview(user?.photoURL || null);
    }
  };

  const modalVariants = {
    hidden: { opacity: 0, scale: 0.9 },
    visible: { opacity: 1, scale: 1, transition: { duration: 0.2, ease: "easeOut" } },
    exit: { opacity: 0, scale: 0.9, transition: { duration: 0.2, ease: "easeIn" } },
  };

  return (
    <AnimatePresence>
      <motion.div
        initial="hidden"
        animate="visible"
        exit="exit"
        variants={modalVariants}
        className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50 p-4"
        onClick={onClose}
      >
        <motion.div
          className="bg-white p-6 rounded-lg shadow-xl w-full max-w-lg relative"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onClose}
            className="absolute top-4 right-4 text-gray-500 hover:text-gray-800 text-xl transition-colors"
          >
            <FaTimes />
          </button>
          
          <h2 className="text-2xl font-bold text-gray-800 mb-4 text-center">প্রোফাইল এডিট করুন</h2>
          
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
            <div className="flex flex-col items-center mb-4">
                <div className="relative w-28 h-28 rounded-full overflow-hidden border-2 border-blue-400">
                    <img src={newImagePreview || user?.photoURL || 'https://i.ibb.co/2d9dK0F/default-profile.png'} alt="Profile Preview" className="w-full h-full object-cover" />
                    <label htmlFor="profilePicture" className="absolute bottom-0 w-full text-center py-1 bg-black bg-opacity-50 text-white cursor-pointer hover:bg-opacity-70 transition-colors">
                        <FaCamera className="inline-block" />
                    </label>
                </div>
                <input
                    type="file"
                    id="profilePicture"
                    className="hidden"
                    onChange={handleImageChange}
                    accept="image/*"
                />
            </div>

            <div>
              <label htmlFor="name" className="block text-gray-700 font-semibold mb-1">নাম</label>
              <input
                type="text"
                id="name"
                {...register('name', { required: 'নাম প্রয়োজন' })}
                className="input input-bordered w-full"
              />
              {errors.name && <p className="text-red-500 text-sm mt-1">{errors.name.message}</p>}
            </div>

            <div>
              <label htmlFor="email" className="block text-gray-700 font-semibold mb-1">ইমেইল</label>
              <input
                type="email"
                id="email"
                {...register('email')}
                className="input input-bordered w-full bg-gray-100"
                readOnly
              />
            </div>

            <div>
              <label htmlFor="role" className="block text-gray-700 font-semibold mb-1">রোল</label>
              <input
                type="text"
                id="role"
                {...register('role')}
                className="input input-bordered w-full bg-gray-100 capitalize"
                readOnly
              />
            </div>

            <motion.button
              type="submit"
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
              className="btn w-full bg-blue-600 text-white rounded-lg py-2 font-bold hover:bg-blue-700 transition-colors"
              disabled={loading}
            >
              {loading ? 'আপডেট হচ্ছে...' : 'প্রোফাইল আপডেট করুন'}
            </motion.button>
          </form>
        </motion.div>
      </motion.div>
    </AnimatePresence>
  );
};

export default EditProfileModal;