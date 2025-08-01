import React from "react";
import { Link } from "react-router-dom";
import { FaFacebook, FaTwitter, FaInstagram, FaLinkedin, FaYoutube } from "react-icons/fa";

const Footer = () => {
  return (
    <footer className="bg-gray-900 text-white py-10 ">
      <div className="w-10/12 mx-auto px-4 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-10">
        {/* Quick Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Quick Links</h3>
          <ul>
            <li>
              <Link to="/" className="text-gray-400 hover:text-white">
                Home
              </Link>
            </li>
            <li>
              <Link
                to="/all-products"
                className="text-gray-400 hover:text-white"
              >
                Shop
              </Link>
            </li>
            <li>
              <Link to="/about-us" className="text-gray-400 hover:text-white">
                About Us
              </Link>
            </li>
            <li>
              <Link to="/contact" className="text-gray-400 hover:text-white">
                Contact
              </Link>
            </li>
            <li>
              <Link to="/faq" className="text-gray-400 hover:text-white">
                FAQ
              </Link>
            </li>
          </ul>
        </div>

        {/* Contact Information */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Contact Information</h3>
          <ul>
            <li className="text-gray-400">Mirpur 2,Kataltola(Online Store)</li>
            <li className="text-gray-400">Phone: 01629810013</li>
            <li className="text-gray-400">Email: jonoprio44@gmail.com</li>
          </ul>
        </div>

        {/* Important  Links */}
        <div className="space-y-4">
          <h3 className="text-lg font-semibold">Important Links</h3>
          <ul>
            <li>
              <Link
                to="/privacy-policy"
                className="text-gray-400 hover:text-white"
              >
                Privacy Policy
              </Link>
            </li>
            <li>
              <Link
                to="/warranty-policy"
                className="text-gray-400 hover:text-white"
              >
                Warranty Policy
              </Link>
            </li>
            <li>
              <Link
                to="/terms-conditions"
                className="text-gray-400 hover:text-white"
              >
                Terms & Conditions
              </Link>
            </li>
            <li>
              <Link
                to="/return-refund"
                className="text-gray-400 hover:text-white"
              >
                Return and Refund Policy
              </Link>
            </li>
            <li>
              <Link
                to="/preOrder-conditions"
                className="text-gray-400 hover:text-white"
              >
                Pre-Order Terms and Conditions
              </Link>
            </li>
          </ul>
        </div>
        {/* Social Media */}
        <div className="space-y-4">
  <h3 className="text-lg font-semibold">Follow Us</h3>
  <div className="flex space-x-4">
    {/* Facebook */}
    <a
      href="https://www.facebook.com/jonoprio44"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#1877F2] hover:text-[#166FE5]"
    >
      <FaFacebook size={20} />
    </a>

    {/* Instagram */}
    <a
      href="https://instagram.com"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#E4405F] hover:text-[#D7354A]"
    >
      <FaInstagram size={20} />
    </a>

    {/* YouTube */}
    <a
      href="https://www.youtube.com/@jonoprio44"
      target="_blank"
      rel="noopener noreferrer"
      className="text-[#FF0000] hover:text-[#C40000]"
    >
      <FaYoutube size={20} />
    </a>
  </div>
</div>

      </div>

      {/* Legal Information */}
      <div className="mt-10 border-t border-gray-700 pt-4 text-center text-gray-400 text-sm">
        <p>
          &copy; {new Date().getFullYear()} Jonoprio.com. All rights reserved.
        </p>
      </div>
    </footer>
  );
};

export default Footer;
