import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { saveUserInDb } from "../API/utilis";
import toast from "react-hot-toast";
import { getAuth, getRedirectResult, updateProfile } from "firebase/auth";

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, googleSignIn, setUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  useEffect(() => {
    const auth = getAuth();
    getRedirectResult(auth).then(async (result) => {
      if (result?.user) {
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
        navigate(from, { replace: true });
      }
    }).catch((error) => {
      console.error("Google Redirect Sign-in Error:", error);
      setError(error.message);
      setLoading(false);
    });
  }, [from, navigate, setUser]);

  const handleSignIn = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    signIn(email, password)
      .then((result) => {
        const user = result.user;
        const userData = {
          name: result?.user?.displayName,
          email: result?.user?.email,
          image: result?.user?.photoURL,
        };
        saveUserInDb(userData);
        navigate(from, { replace: true });
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        setError(errorCode);
      });
  };

  const handleGoogleLogIn = () => {
    googleSignIn()
      .then((result) => {
        const user = result.user;

        const name = user.displayName;
        const photoURL = user.photoURL;

        const auth = getAuth();

        updateProfile(auth.currentUser, { displayName: name, photoURL })
          .then(() => {
            setUser({ ...user, displayName: name, photoURL });

            const userData = {
              name: user.displayName,
              email: user.email,
              image: user.photoURL,
            };

            saveUserInDb(userData);

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
      <div className="flex items-center justify-center min-h-screen py-12 relative z-10">
        <div className="card bg-white w-full max-w-md shrink-0 shadow-xl rounded-xl p-6">
          <div className="card-body text-center">
            <h1 className="font-bold text-2xl text-gray-900 mb-6">Welcome Back to Jonopio.com</h1>
            <form onSubmit={handleSignIn} className="space-y-4">
              <div>
                <label className="label text-left block text-gray-900 font-medium">Email</label>
                <input name="email" type="email" className="input input-bordered w-full bg-white text-gray-900 placeholder-gray-500" placeholder="Email" required />
              </div>
              <div>
                <label className="label text-left block text-gray-900 font-medium">Password</label>
                <input name="password" type="password" className="input input-bordered w-full bg-white text-gray-900 placeholder-gray-500" placeholder="Password" required />
              </div>
              {error && <p className="text-red-600 text-sm">{error}</p>}
              <button type="submit" className="btn btn-neutral w-full mt-4 text-white hover:bg-gray-700 transition-colors duration-300" disabled={loading}>
                {loading ? "Logging in..." : "Login"}
              </button>
            </form>

            <button
              onClick={handleGoogleLogIn}
              type="button"
              className="btn w-full mt-4 bg-white border-gray-300 text-gray-900 hover:bg-gray-100 flex items-center justify-center gap-3 transition-colors duration-300"
              disabled={loading}
            >
              <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" className="w-6 h-6" />
              Sign up with Google
            </button>

            <p className="text-gray-900 mt-4 text-sm">
              Don’t Have An Account? <Link className="text-teal-600 hover:underline" to="/signup">Register</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;