import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { useContext } from "react";
import { AuthContext } from "../Context/AuthProvider";

const ResetPassword = () => {
  const [error, setError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const { resetUserPassword } = useContext(AuthContext);
  const navigate = useNavigate();
  const location = useLocation();
  const email = location.state?.email || "";

  const handleResetPassword = (e) => {
    e.preventDefault();
    const email = e.target.email.value;

    if (!email) {
      setError("Please enter your email address");
      return;
    }

    // Simple email format validation
    const emailPattern = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
    if (!emailPattern.test(email)) {
      setError("Please enter a valid email address");
      return;
    }

    resetUserPassword(email)
      .then(() => {
        setSuccessMessage("Password reset email sent! Please check your inbox.");
        setError("");
        setTimeout(() => navigate("/login"), 3000);  // Redirect after 3 seconds
      })
      .catch((error) => {
        setError("Error resetting password: " + error.message);
        setSuccessMessage("");
      });
  };

  return (
    <div className="min-h-screen bg-gradient-to-r from-blue-400 to-purple-600 flex items-center justify-center py-8">
      <div className="w-full max-w-sm bg-white rounded-xl shadow-lg p-6">
        <h1 className="text-3xl font-bold text-center text-gray-800 mb-6">
          Reset Your Password
        </h1>
        <form onSubmit={handleResetPassword} className="space-y-4">
          <div>
            <label className="block text-sm font-semibold text-gray-600">Email</label>
            <input
              name="email"
              type="email"
              defaultValue={email}
              placeholder="Enter your email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full bg-blue-600 text-white font-semibold py-2 rounded-lg hover:bg-blue-700 transition duration-300"
          >
            Reset Password
          </button>
        </form>

        {error && <p className="text-red-500 text-sm mt-4">{error}</p>}
        {successMessage && <p className="text-green-500 text-sm mt-4">{successMessage}</p>}
      </div>
    </div>
  );
};

export default ResetPassword;
