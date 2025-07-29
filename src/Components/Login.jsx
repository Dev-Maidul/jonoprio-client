import React, { useState, useContext, useEffect } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { AuthContext } from "../Context/AuthProvider";
import { saveUserInDb } from "../API/utilis";
import toast from "react-hot-toast";
import { getAuth, getRedirectResult, updateCurrentUser } from "firebase/auth";
 import {updateProfile } from "firebase/auth"; // Import the correct function
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

// Handle login by email and password
  const handleSignIn = (e) => {
    e.preventDefault();
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    // user sign in
    signIn(email, password)
      .then((result) => {
        const user = result.user;
        // create user data for db
        const userData = {
          name: result?.user?.displayName,
          email: result?.user?.email,
          image: result?.user?.photoURL,
        };
        // save user in the db
        saveUserInDb(userData);
        navigate(from, { replace: true });
        // navigate(`${location.state ? location.state: "/"}`)
        console.log(user);
      })
      .catch((error) => {
        const errorCode = error.code;
        // const errorMessage=error.message;
        setError(errorCode);
      });
  };
  // Handle google Login


const handleGoogleLogIn = () => {
  googleSignIn()
    .then((result) => {
      const user = result.user;

      const name = user.displayName;
      const photoURL = user.photoURL;

      // Correct method to update user profile
      const auth = getAuth(); // Get the current auth instance

      updateProfile(auth.currentUser, { displayName: name, photoURL }) // Use updateProfile here
        .then(() => {
          setUser({ ...user, displayName: name, photoURL });

          // create user data for db
          const userData = {
            name: user.displayName,
            email: user.email,
            image: user.photoURL,
          };

          // Save user in the DB
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
    <div className="flex items-center justify-center mt-4 py-8">
      <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
        <div className="card-body">
          <h1 className="font-bold text-center text-xl">Welcome Back to Jonopio.com</h1>
          <form onSubmit={handleSignIn} className="fieldset">
            <label className="label">Email</label>
            <input name="email" type="email" className="input" placeholder="Email" required />
            <label className="label">Password</label>
            <input name="password" type="password" className="input" placeholder="Password" required />
            {error && <p className="text-red-500">{error}</p>}
            <button type="submit" className="btn btn-neutral mt-4" disabled={loading}>
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <button
            onClick={handleGoogleLogIn}
            type="button"
            className="btn w-full bg-white border mt-2 flex items-center justify-center gap-2"
            disabled={loading}
          >
            <img src="https://img.icons8.com/color/48/000000/google-logo.png" alt="Google" className="w-5 h-5" />
            Sign up with Google
          </button>

          <p className="font-semibold">
            Don’t Have An Account? <Link className="text-secondary" to="/signup">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default Login;
