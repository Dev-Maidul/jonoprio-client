import React, { useContext, useState } from "react";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import toast from "react-hot-toast";
import { motion } from "framer-motion";
import { imageUpload, saveUserInDb } from "../API/utilis";


const Signup = () => {
  const { CreateUser, setUser, updateUser, googleSignIn } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [success, setSuccess] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [loading, setLoading] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  const handleGoogleLogIn = () => {
    googleSignIn()
      .then((result) => {
        const user = result.user;
        const userData = {
          name: user.displayName,
          email: user.email,
          image: user.photoURL,
        };
        saveUserInDb(userData);
        updateUser({ displayName: user.displayName, photoURL: user.photoURL })
          .then(() => {
            setUser({ ...user, displayName: user.displayName, photoURL: user.photoURL });
            navigate(from, { replace: true });
          })
          .catch((error) => {
            setUser(user);
            console.log(error);
          });
      })
      .catch((error) => {
        console.log(error);
      });
  };

  const handleSignup = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setErrorMessage("");
    setLoading(true);

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;

    if (password.length < 6 || !/[a-z]/.test(password) || !/[A-Z]/.test(password)) {
      setErrorMessage("Password must contain at least 6 characters, one lowercase and one uppercase letter.");
      setLoading(false);
      return;
    }

    let imageUrl = "https://i.ibb.co/2d9dK0F/default-profile.png";
    if (imageFile) {
      try {
        imageUrl = await imageUpload(imageFile);
      } catch {
        toast.error("Image upload failed! Default image will be used.");
      }
    }

    CreateUser(email, password)
      .then((result) => {
        const user = result.user;
        const userData = {
          name: name || "Anonymous",
          email,
          image: imageUrl,
        };
        saveUserInDb(userData);
        toast.success("Registration Successful");
        updateUser({ displayName: name, photoURL: imageUrl })
          .then(() => {
            setUser({ ...user, displayName: name, photoURL: imageUrl });
            setSuccess(true);
            setLoading(false);
            navigate(from, { replace: true });
          })
          .catch((error) => {
            setUser(user);
            setLoading(false);
            console.log(error);
          });
      })
      .catch((error) => {
        setLoading(false);
        setErrorMessage(error.message);
      });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImageFile(file);
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => setImagePreview(reader.result);
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-tr from-[#f0f4ff] to-[#ffe6f0] py-12 px-4 sm:px-6 lg:px-32">
      <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden flex flex-col lg:flex-row">
        <div className="w-full lg:w-1/2 p-8 sm:p-10">
          <h2 className="text-3xl font-extrabold text-gray-800 mb-6 text-center">Create Your Account</h2>
          <form onSubmit={handleSignup} className="space-y-5">
            <input
              name="name"
              type="text"
              required
              placeholder="Full Name"
              className="input input-bordered w-full"
            />
            <input
              name="photo"
              type="file"
              accept="image/*"
              onChange={handleImageChange}
              className="file-input file-input-bordered w-full"
            />
            {imagePreview && (
              <img
                src={imagePreview}
                alt="Preview"
                className="w-20 h-20 object-cover rounded-full mx-auto border"
              />
            )}
            <input
              name="email"
              type="email"
              required
              placeholder="Email"
              className="input input-bordered w-full"
            />
            <div className="relative">
              <input
                name="password"
                type={showPassword ? "text" : "password"}
                required
                placeholder="Password"
                className="input input-bordered w-full"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-4 top-3 text-gray-500"
              >
                {showPassword ? <FaRegEye /> : <FaEyeSlash />}
              </button>
            </div>
            <button
              type="submit"
              className="btn w-full bg-gradient-to-r from-[#ff8a05] via-[#ff5478] to-[#ff00c6] text-white font-bold"
              disabled={loading}
            >
              {loading ? "Registering..." : "Register"}
            </button>
            <button
              onClick={handleGoogleLogIn}
              type="button"
              className="btn w-full bg-white border mt-2 flex items-center justify-center gap-2"
            >
              <img
                src="https://img.icons8.com/color/48/000000/google-logo.png"
                alt="Google"
                className="w-5 h-5"
              /> Sign up with Google
            </button>
            <p className="text-sm mt-2 text-center">
              Already have an account? <Link to="/login" className="text-primary underline">Log in</Link>
            </p>
            {errorMessage && <p className="text-red-500 text-sm text-center">{errorMessage}</p>}
            {success && <p className="text-green-500 text-sm text-center">Account created successfully</p>}
          </form>
        </div>
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#ffe3ec] to-[#e3f2fd] p-10 flex flex-col justify-center items-center text-center">
          <motion.h3
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
            className="text-3xl font-bold text-gray-700 mb-4"
          >
            Join Jonoprio Today
          </motion.h3>
          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="text-gray-600"
          >
            Explore the marketplace, sell your products, and enjoy exclusive deals on your favorite items.
          </motion.p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
