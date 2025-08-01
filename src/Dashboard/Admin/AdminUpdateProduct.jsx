import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import toast from 'react-hot-toast';


function AdminUpdateProduct() {
  const { productId } = useParams(); // Get the productId from the URL
  const [product, setProduct] = useState(null);
  const [updatedProductData, setUpdatedProductData] = useState({});
  const axiosSecure = useAxiosSecure(); // Using the custom axios hook
  const navigate = useNavigate(); // Initialize navigate function for redirection

  useEffect(() => {
    // Fetch the product details from the backend using product ID
    axiosSecure.get(`/admin/products/details/${productId}`)
      .then((response) => {
        setProduct(response.data);
        setUpdatedProductData(response.data); // Initialize updated data
      })
      .catch((error) => {
        console.error("There was an error fetching the product!", error);
      });
  }, [productId, axiosSecure]);

  // Handle updating the product
  const handleUpdateProduct = () => {
    const { _id, ...updatedData } = updatedProductData; // Extract product ID and updated fields
    axiosSecure.put(`/admin/products/update/${_id}`, updatedData) // Update the product in the backend
      .then(() => {
        toast.success("Product updated successfully")
        navigate('/dashboard/manage-products'); // Redirect back to the product management page
      })
      .catch(error => {
        console.error("Error updating product:", error);
      });
  };

  if (!product) {
    return <div>Loading...</div>; // Show loading until product data is fetched
  }

  return (
    <div className="p-6">
      <h2 className="text-2xl font-semibold mb-4">Update Product</h2>
      <div className="w-full max-w-3xl mx-auto">
        {/* Display product details and allow updating */}
        <div className="mb-4">
          <label className="block">Product Name</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={updatedProductData.productName}
            onChange={(e) => setUpdatedProductData({ ...updatedProductData, productName: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="block">Special Price</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={updatedProductData.specialPrice}
            onChange={(e) => setUpdatedProductData({ ...updatedProductData, specialPrice: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="block">Price</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={updatedProductData.price}
            onChange={(e) => setUpdatedProductData({ ...updatedProductData, price: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="block">Stock</label>
          <input
            type="number"
            className="w-full p-2 border border-gray-300 rounded"
            value={updatedProductData.stock}
            onChange={(e) => setUpdatedProductData({ ...updatedProductData, stock: e.target.value })}
          />
        </div>

        <div className="mb-4">
          <label className="block">Description</label>
          <textarea
            className="w-full p-2 border border-gray-300 rounded"
            value={updatedProductData.description}
            onChange={(e) => setUpdatedProductData({ ...updatedProductData, description: e.target.value })}
          />
        </div>

        {/* Read-Only Email */}
        <div className="mb-4">
          <label className="block">Seller Email</label>
          <input
            type="text"
            className="w-full p-2 border border-gray-300 rounded"
            value={updatedProductData.sellerEmail}
            readOnly
          />
        </div>

        <div className="flex gap-2">
          <button
            className="bg-blue-500 text-white px-4 py-2 rounded-lg hover:bg-blue-600 cursor-pointer"
            onClick={handleUpdateProduct}
          >
            Save Changes
          </button>
          <button
            className="bg-gray-500 text-white px-4 py-2 rounded-lg hover:bg-gray-700 cursor-pointer"
            onClick={() => navigate('/dashboard/admin/manage-products')} // Navigate back to the product management page
          >
            Cancel
          </button>
        </div>
      </div>
    </div>
  );
}

export default AdminUpdateProduct;
