import { Link, useLocation, useNavigate } from "react-router";

import { use, useState } from "react";
import { AuthContext } from "../Context/AuthProvider";
import { saveUserInDb } from "../API/utilis";


const Login = () => {
  const [error, setError] = useState("");
  const { signIn, googleSignIn, setUser, updateUser } = use(AuthContext);
  const location = useLocation();
  const navigate = useNavigate();
  const from = location.state?.from || "/";
  const handleForgotPassword = (e) => {
    e.preventDefault();
    const email = document.querySelector('input[name="email"]').value;
    navigate("/forgot-password", { state: { email } });
  };
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
        // console.log(result);
        const user = result.user;

        const name = user.displayName;
        const photoURL = user.photoURL;
        updateUser({ displayName: name, photoURL })
          .then(() => {
            setUser({ ...user, displayName: name, photoURL });
            // create user data for db
             const userData = {
        name: result?.user?.displayName,
        email: result?.user?.email,
        image: result?.user?.photoURL,
      }
      // /save User in the DB
      saveUserInDb(userData)
            navigate(from, { replace: true });
            // navigate('/');
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
      <title>Log In</title>

      <div className="hero">
        <div className="card bg-base-100 w-full max-w-sm shrink-0 shadow-2xl">
          <div className="card-body">
            <h1 className="font-bold text-center text-xl">
              Welcome Back to Jonopio.com
            </h1>

            <form onSubmit={handleSignIn} className="fieldset">
              <label className="label">Email</label>
              <input
                name="email"
                type="email"
                className="input"
                placeholder="Email"
                required
              />
              <label className="label">Password</label>
              <input
                name="password"
                type="password"
                className="input"
                placeholder="Password"
                required
              />
              <div>
                <a onClick={handleForgotPassword} className="link link-hover">
                  Forgot password?
                </a>
              </div>
              {error && <p className="text-red-500">{error}</p>}
              <button type="submit" className="btn btn-neutral mt-4">
                Login
              </button>
            </form>
            <button
              onClick={handleGoogleLogIn}
              className="btn bg-white text-black border-[#e5e5e5]"
            >
              <svg
                aria-label="Google logo"
                width="16"
                height="16"
                xmlns="http://www.w3.org/2000/svg"
                viewBox="0 0 512 512"
              >
                <g>
                  <path d="m0 0H512V512H0" fill="#fff"></path>
                  <path
                    fill="#34a853"
                    d="M153 292c30 82 118 95 171 60h62v48A192 192 0 0190 341"
                  ></path>
                  <path
                    fill="#4285f4"
                    d="m386 400a140 175 0 0053-179H260v74h102q-7 37-38 57"
                  ></path>
                  <path
                    fill="#fbbc02"
                    d="m90 341a208 200 0 010-171l63 49q-12 37 0 73"
                  ></path>
                  <path
                    fill="#ea4335"
                    d="m153 219c22-69 116-109 179-50l55-54c-78-75-230-72-297 55"
                  ></path>
                </g>
              </svg>
              Login with Google
            </button>
            <p className="font-semibold">
              Dont’t Have An Account ?{" "}
              <Link className="text-secondary" to="/signup">
                Register
              </Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
