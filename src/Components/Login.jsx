import React, { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { saveUserInDb } from "../API/utilis";
import toast from "react-hot-toast";

const Login = () => {
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const { signIn, googleSignIn, setUser } = useContext(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";

  const handleSignIn = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError("");
    const form = e.target;
    const email = form.email.value;
    const password = form.password.value;

    try {
      const result = await signIn(email, password);
      const user = result.user;

      const userDataForDb = {
        name: user.displayName || "Anonymous",
        email: user.email,
        image: user.photoURL || "https://i.ibb.co/2d9dK0F/default-profile.png",
        uid: user.uid,
      };

      await saveUserInDb(userDataForDb);

      setUser(user);
      toast.success("Login Successful!");
      navigate(from, { replace: true });
    } catch (firebaseError) {
      setError(firebaseError.message);
    } finally {
      setLoading(false);
    }
  };

  const handleGoogleLogIn = async () => {
    setLoading(true);
    setError("");
    try {
      const result = await googleSignIn();
      const user = result.user;

      const userDataForDb = {
        name: user.displayName || "Anonymous",
        email: user.email,
        image: user.photoURL || "https://i.ibb.co/2d9dK0F/default-profile.png",
        uid: user.uid,
      };

      await saveUserInDb(userDataForDb);

      setUser(user);
      toast.success("Google Sign-in Successful!");
      navigate(from, { replace: true });
    } catch (error) {
      setError(error.message);
    } finally {
      setLoading(false);
    }
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