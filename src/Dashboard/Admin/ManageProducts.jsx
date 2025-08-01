import React, { useEffect, useState } from 'react';
import { FaEye, FaCheck, FaTimes, FaPen, FaTrash } from 'react-icons/fa'; // Importing icons

import { useNavigate } from 'react-router-dom'; // Importing useNavigate hook
import useAxiosSecure from '../../hooks/useAxiosSecure';

function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const axiosSecure = useAxiosSecure(); // Using the custom axios hook
  const navigate = useNavigate(); // useNavigate hook for redirection

  // Fetching products from the server on component mount
  useEffect(() => {
    axiosSecure.get('/admin/products') // Fetch products from the admin API
      .then((response) => {
        setProducts(response.data);
      })
      .catch((error) => {
        console.error("There was an error fetching the products!", error);
      });
  }, [axiosSecure]);

  // Handle opening the View Modal to view product details
  const handleView = (product) => {
    setSelectedProduct(product);
    setShowViewModal(true);
  };

  // Handle closing the modal
  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedProduct(null);
  };

  const handleUpdate = (productId) => {
    navigate(`/dashboard/admin/update-product/${productId}`); // Redirect to AdminUpdateProduct page with productId
  };

  // Handle approving the product
  const handleApprove = (productId) => {
    axiosSecure.put(`/admin/products/approve/${productId}`)
      .then(() => {
        setProducts(products.map(p => p._id === productId ? { ...p, status: 'approved' } : p));
      })
      .catch(error => {
        console.error("Error approving product", error);
      });
  };

  // Handle rejecting the product
  const handleReject = (productId) => {
    axiosSecure.put(`/admin/products/reject/${productId}`)
      .then(() => {
        setProducts(products.map(p => p._id === productId ? { ...p, status: 'rejected' } : p));
      })
      .catch(error => {
        console.error("Error rejecting product", error);
      });
  };

  // Handle deleting the product
  const handleDelete = (productId) => {
    axiosSecure.delete(`/admin/products/delete/${productId}`)
      .then(() => {
        setProducts(products.filter(p => p._id !== productId));
      })
      .catch(error => {
        console.error("Error deleting product", error);
      });
  };

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Manage Products</h2>
      <table className="min-w-full bg-white border border-gray-200 rounded-lg shadow-md">
        <thead className="bg-gray-100">
          <tr>
            <th className="px-4 py-2 text-left">S.No</th>
            <th className="px-4 py-2 text-left">Name</th>
            <th className="px-4 py-2 text-left">Image</th>
            <th className="px-4 py-2 text-left">Price</th> {/* Updated column title */}
            <th className="px-4 py-2 text-left">Status</th>
            <th className="px-4 py-2 text-left">Actions</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product, index) => (
            <tr key={product._id} className="border-t">
              <td className="px-4 py-2">{index + 1}</td>
              <td className="px-4 py-2">{product.productName}</td>
              <td className="px-4 py-2">
                {product.images && product.images.length > 0 ? (
                  <img src={product.images[0].url} alt={product.productName} className="w-12 h-12 object-cover" />
                ) : (
                  <span>No Image</span>
                )}
              </td>
              <td className="px-4 py-2">{product.specialPrice}</td> {/* Show specialPrice instead of price */}
              <td className="px-4 py-2">{product.status}</td>
              <td className="px-4 py-2 flex gap-3">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer flex items-center gap-1"
                  onClick={() => handleView(product)} // Open View Modal
                >
                  <FaEye /> View
                </button>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 cursor-pointer flex items-center gap-1"
                  onClick={() => handleUpdate(product._id)} // Redirect on Update button click
                >
                  <FaPen /> Update
                </button>
                <button
                  className="bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 cursor-pointer flex items-center gap-1"
                  onClick={() => handleApprove(product._id)}
                >
                  <FaCheck /> Approve
                </button>
                <button
                  className="bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer flex items-center gap-1"
                  onClick={() => handleReject(product._id)}
                >
                  <FaTimes /> Reject
                </button>
                <button
                  className="bg-red-600 text-white px-4 py-2 rounded-lg hover:bg-red-700 cursor-pointer flex items-center gap-1"
                  onClick={() => handleDelete(product._id)}
                >
                  <FaTrash /> Delete
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      {/* View Product Modal */}
      {showViewModal && selectedProduct && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Product Details</h3>
            <p><strong>Name:</strong> {selectedProduct.productName}</p>
            <p><strong>Special Price:</strong> {selectedProduct.specialPrice}</p> {/* Show specialPrice here */}
            <p><strong>Description:</strong> {selectedProduct.description}</p>
            <p><strong>Seller:</strong> {selectedProduct.sellerName} ({selectedProduct.sellerEmail})</p>
            <p><strong>Status:</strong> {selectedProduct.status}</p>
            <p><strong>Category:</strong> {selectedProduct.category}</p>
            <div className="mt-4 flex gap-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 cursor-pointer"
                onClick={handleCloseViewModal} // Close the View Modal
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageProducts;
