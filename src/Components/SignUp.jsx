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

  const handleSignup = async (e) => {
    e.preventDefault();
    setSuccess(false);
    setErrorMessage("");
    setLoading(true);

    const name = e.target.name.value;
    const email = e.target.email.value;
    const password = e.target.password.value;
    const terms = e.target.elements.terms.checked;

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
        saveUserInDb(userData);

        toast.success("Registration Successful");
        updateUserProfile({ displayName: name, photoURL: imageUrl })
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
    } else {
      setImagePreview(null);
    }
  };

  return (
    <div className="min-h-screen w-full bg-[#fafafa] relative text-gray-900 rounded-2xl mb-8">
      {/* Diagonal Grid with Electric Orange */}
      <div
        className="absolute inset-0 z-0 pointer-events-none"
        style={{
          backgroundImage: `
            repeating-linear-gradient(45deg, rgba(255, 0, 100, 0.1) 0, rgba(255, 0, 100, 0.1) 1px, transparent 1px, transparent 20px),
            repeating-linear-gradient(-45deg, rgba(255, 0, 100, 0.1) 0, rgba(255, 0, 100, 0.1) 1px, transparent 1px, transparent 20px)
          `,
          backgroundSize: "40px 40px",
        }}
      />
      <div className="flex items-center justify-center min-h-screen py-12 px-4 sm:px-6 lg:px-32 relative z-10">
        <div className="max-w-6xl mx-auto bg-white shadow-xl rounded-xl overflow-hidden flex flex-col lg:flex-row">
          <div className="w-full lg:w-1/2 p-8 sm:p-10">
            <h2 className="text-3xl font-extrabold text-gray-900 mb-6 text-center">Create Your Account</h2>
            <form onSubmit={handleSignup} className="space-y-6">
              <input
                name="name"
                type="text"
                required
                placeholder="Full Name"
                className="input input-bordered w-full text-gray-900 placeholder-gray-500"
              />
              <input
                name="photo"
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="file-input file-input-bordered w-full text-gray-900"
              />
              {imagePreview && (
                <img
                  src={imagePreview}
                  alt="Preview"
                  className="w-24 h-24 object-cover rounded-full mx-auto border-2 border-gray-300"
                />
              )}
              <input
                name="email"
                type="email"
                required
                placeholder="Email"
                className="input input-bordered w-full text-gray-900 placeholder-gray-500"
              />
              <div className="relative">
                <input
                  name="password"
                  type={showPassword ? "text" : "password"}
                  required
                  placeholder="Password"
                  className="input input-bordered w-full text-gray-900 placeholder-gray-500 pr-12"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-4 top-3 text-gray-600 hover:text-gray-900"
                >
                  {showPassword ? <FaRegEye /> : <FaEyeSlash />}
                </button>
              </div>

              <label className="flex items-center mt-2 text-gray-700">
                <input
                  type="checkbox"
                  name="terms"
                  required
                  className="mr-2 accent-teal-600"
                />
                I agree to the terms and conditions
              </label>

              <button
                type="submit"
                className="btn w-full bg-gradient-to-r from-[#ff8a05] via-[#ff5478] to-[#ff00c6] text-white font-bold hover:from-[#ff6f00] hover:via-[#ff4060] hover:to-[#e600b2] transition-all duration-300"
                disabled={loading}
              >
                {loading ? "Registering..." : "Register"}
              </button>
              <button
                onClick={handleGoogleLogIn}
                type="button"
                className="btn w-full bg-white border-gray-300 text-gray-900 hover:bg-gray-100 flex items-center justify-center gap-3 transition-colors duration-300"
                disabled={loading}
              >
                <img
                  src="https://img.icons8.com/color/48/000000/google-logo.png"
                  alt="Google"
                  className="w-6 h-6"
                />
                Sign up with Google
              </button>
              <p className="text-sm mt-2 text-center text-gray-700">
                Already have an account? <Link to="/login" className="text-teal-600 hover:underline">Log in</Link>
              </p>
              {errorMessage && <p className="text-red-600 text-sm text-center">{errorMessage}</p>}
            </form>
          </div>
          <div className="w-full lg:w-1/2 bg-gradient-to-br from-[#ffe3ec] to-[#e3f2fd] p-10 flex flex-col justify-center items-center text-center">
            <h3 className="text-3xl font-bold text-gray-800 mb-4">
              Join Jonoprio Today
            </h3>
            <p className="text-gray-700">
              Explore the marketplace, sell your products, and enjoy exclusive deals on your favorite items.
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;