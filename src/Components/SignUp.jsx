import React, { useState, useContext, useEffect } from "react";
import { FaEyeSlash, FaRegEye } from "react-icons/fa";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import toast from "react-hot-toast";
import { saveUserInDb, imageUpload } from "../API/utilis";
import { getAuth, getRedirectResult } from "firebase/auth";

const Signup = () => {
  const { CreateUser, setUser, updateUserProfile, googleSignIn } = useContext(AuthContext);
  const [errorMessage, setErrorMessage] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const [imageFile, setImageFile] = useState(null);
  const [imagePreview, setImagePreview] = useState(null);
  const [success, setSuccess] = useState(false);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  useEffect(() => {
    const auth = getAuth();
    getRedirectResult(auth)
      .then(async (result) => {
        if (result && result.user) {
          const user = result.user;
          const userData = {
            name: user.displayName || "Anonymous",
            email: user.email,
            image: user.photoURL || "https://i.ibb.co/2d9dK0F/default-profile.png",
            uid: user.uid,
          };

          await saveUserInDb(userData);

          setUser(user);
          toast.success("Google Sign-in Successful!");
          setLoading(false);
          navigate(from, { replace: true });
        }
      })
      .catch((error) => {
        console.error("Google Redirect Sign-in Error:", error);
        setErrorMessage(error.message);
        setLoading(false);
      });
  }, [from, navigate, setUser]);

  // Google Sign In
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
        updateUserProfile({ displayName: user.displayName, photoURL: user.photoURL })
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

  // Email/Password Signup
  const handleSignup = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setErrorMessage("");
    setLoading(true);

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const terms = e.target.elements.terms.checked; // Fixed here

    // Password validation
    if (password.length < 6) {
      setErrorMessage("Password must be at least 6 characters");
      setLoading(false);
      return;
    }
    if (!terms) {
      setErrorMessage("Please accept our terms and conditions");
      setLoading(false);
      return;
    }
    if (!/[a-z]/.test(password)) {
      setErrorMessage("Password should contain at least one lowercase letter.");
      setLoading(false);
      return;
    }
    if (!/[A-Z]/.test(password)) {
      setErrorMessage("Password should contain at least one uppercase letter.");
      setLoading(false);
      return;
    }

    let imageUrl = "https://i.ibb.co/2d9dK0F/default-profile.png";
    // If user uploaded an image, upload to image host
    if (imageFile) {
      try {
        imageUrl = await imageUpload(imageFile);
      } catch (err) {
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
        // Save user data in DB
        saveUserInDb(userData);

        toast.success("Registration Successful");
        updateUserProfile({ displayName: name, photoURL: imageUrl })
          .then(() => {
            setUser({ ...user, displayName: name, photoURL: imageUrl });
            setSuccess(true); // Set success state to true when registration is successful
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
    } else {
      setImagePreview(null);
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

            <label className="flex items-center mt-2">
              <input
                type="checkbox"
                name="terms"
                required
                className="mr-2"
              />
              I agree to the terms and conditions
            </label>

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
          </form>
        </div>
        <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#ffe3ec] to-[#e3f2fd] p-10 flex flex-col justify-center items-center text-center">
          <h3 className="text-3xl font-bold text-gray-700 mb-4">
            Join Jonoprio Today
          </h3>
          <p className="text-gray-600">
            Explore the marketplace, sell your products, and enjoy exclusive deals on your favorite items.
          </p>
        </div>
      </div>
    </div>
  );
};

export default Signup;
