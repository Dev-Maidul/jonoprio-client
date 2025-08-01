import React, { useEffect, useState } from 'react';
import { FaEye, FaCheck, FaTimes, FaPen, FaTrash } from 'react-icons/fa'; // Importing icons
import useAxiosSecure from '../../Hooks/useAxiosSecure';


function ManageProduct() {
  const [products, setProducts] = useState([]);
  const [showViewModal, setShowViewModal] = useState(false);
  const [showUpdateModal, setShowUpdateModal] = useState(false);
  const [selectedProduct, setSelectedProduct] = useState(null);
  const [updatedProductData, setUpdatedProductData] = useState({});
  const axiosSecure = useAxiosSecure(); // Using the custom axios hook

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

  // Handle opening the Update Modal to edit product details
  const handleUpdate = (product) => {
    setUpdatedProductData({ ...product }); // Pre-populate form with existing data
    setShowUpdateModal(true);
  };

  // Handle updating the product
  const handleUpdateProduct = () => {
    const { _id, ...updatedData } = updatedProductData; // Extract product ID and updated fields
    axiosSecure.put(`/admin/products/update/${_id}`, updatedData)
      .then(() => {
        setProducts(products.map(p => p._id === _id ? { ...p, ...updatedData } : p)); // Update UI locally
        setShowUpdateModal(false); // Close modal
      })
      .catch(error => {
        console.error("Error updating product:", error);
      });
  };

  // Handle closing the modals
  const handleCloseViewModal = () => {
    setShowViewModal(false);
    setSelectedProduct(null);
  };

  const handleCloseUpdateModal = () => {
    setShowUpdateModal(false);
    setUpdatedProductData({});
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
            <th className="px-4 py-2 text-left">Price</th>
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
              <td className="px-4 py-2">{product.price}</td>
              <td className="px-4 py-2">{product.status}</td>
              <td className="px-4 py-2 flex gap-3">
                <button
                  className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer flex items-center gap-1"
                  onClick={() => handleView(product)}
                >
                  <FaEye /> View
                </button>
                <button
                  className={`bg-green-500 text-white px-4 py-2 rounded-lg hover:bg-green-600 cursor-pointer flex items-center gap-1 ${product.status === 'approved' ? 'cursor-not-allowed opacity-50' : ''}`}
                  onClick={() => handleApprove(product._id)}
                  disabled={product.status === 'approved'}
                >
                  <FaCheck /> Approve
                </button>
                <button
                  className={`bg-red-500 text-white px-4 py-2 rounded-lg hover:bg-red-600 cursor-pointer flex items-center gap-1 ${product.status === 'rejected' ? 'cursor-not-allowed opacity-50' : ''}`}
                  onClick={() => handleReject(product._id)}
                  disabled={product.status === 'rejected'}
                >
                  <FaTimes /> Reject
                </button>
                <button
                  className="bg-yellow-500 text-white px-4 py-2 rounded-lg hover:bg-yellow-600 cursor-pointer flex items-center gap-1"
                  onClick={() => handleUpdate(product)}
                >
                  <FaPen /> Update
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
            <p><strong>Price:</strong> {selectedProduct.price}</p>
            <p><strong>Description:</strong> {selectedProduct.description}</p>
            <p><strong>Seller:</strong> {selectedProduct.sellerName} ({selectedProduct.sellerEmail})</p>
            <p><strong>Status:</strong> {selectedProduct.status}</p>
            <p><strong>Category:</strong> {selectedProduct.category}</p>
            <div className="mt-4 flex gap-2">
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 cursor-pointer"
                onClick={handleCloseViewModal}
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Update Product Modal */}
      {showUpdateModal && updatedProductData && (
        <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex justify-center items-center">
          <div className="bg-white p-6 rounded-lg shadow-lg w-96">
            <h3 className="text-xl font-semibold mb-4">Update Product</h3>
            <input
              type="text"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              placeholder="Product Name"
              value={updatedProductData.productName}
              onChange={(e) => setUpdatedProductData({ ...updatedProductData, productName: e.target.value })}
            />
            <input
              type="number"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              placeholder="Price"
              value={updatedProductData.price}
              onChange={(e) => setUpdatedProductData({ ...updatedProductData, price: e.target.value })}
            />
            <textarea
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              placeholder="Description"
              value={updatedProductData.description}
              onChange={(e) => setUpdatedProductData({ ...updatedProductData, description: e.target.value })}
            ></textarea>

            {/* Read-Only Fields */}
            <input
              type="text"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              placeholder="Seller Name"
              value={updatedProductData.sellerName}
              readOnly
            />
            <input
              type="email"
              className="w-full p-2 mb-4 border border-gray-300 rounded"
              placeholder="Seller Email"
              value={updatedProductData.sellerEmail}
              readOnly
            />

            <div className="flex gap-2 mt-4">
              <button
                className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
                onClick={handleUpdateProduct}
              >
                Save Changes
              </button>
              <button
                className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 cursor-pointer"
                onClick={handleCloseUpdateModal}
              >
                Cancel
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default ManageProduct;
