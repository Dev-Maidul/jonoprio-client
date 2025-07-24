import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../../Context/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaEye, FaShoppingBag, FaDollarSign, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';

const MyProducts = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [expandedVariants, setExpandedVariants] = useState({});
  const [editingCell, setEditingCell] = useState(null);
  const [editedValue, setEditedValue] = useState('');
  const inputRef = useRef(null);

  // Fetch seller's products
  const { data: products, isLoading, isError, error } = useQuery({
    queryKey: ['myProducts', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const { data } = await axiosSecure.get(`/seller/products/${user.email}`); // This route no longer requires auth on server
      return data;
    },
    enabled: !!user?.email,
  });

  // Focus on the input field when editing starts
  useEffect(() => {
    if (editingCell && inputRef.current) {
      inputRef.current.focus();
    }
  }, [editingCell]);

  // Mutation for updating product (inline edits, status toggle)
  const updateProductMutation = useMutation({
    mutationFn: async ({ productId, updateData }) => {
      const { data } = await axiosSecure.put(`/seller/product/${productId}`, updateData); // This route no longer requires auth on server
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myProducts', user?.email]);
      toast.success('Product updated successfully!');
      setEditingCell(null);
    },
    onError: (error) => {
      console.error("Error updating product:", error);
      toast.error(error.response?.data?.message || 'Failed to update product.');
    },
  });

  // Mutation for deleting product
  const deleteProductMutation = useMutation({
    mutationFn: async (productId) => {
      const { data } = await axiosSecure.delete(`/seller/product/${productId}`); // This route no longer requires auth on server
      return data;
    },
    onSuccess: () => {
      queryClient.invalidateQueries(['myProducts', user?.email]);
      toast.success('Product deleted successfully!');
    },
    onError: (error) => {
      console.error("Error deleting product:", error);
      toast.error(error.response?.data?.message || 'Failed to delete product.');
    },
  });

  // Toggle variant expansion
  const toggleVariants = (productId) => {
    setExpandedVariants(prev => ({
      ...prev,
      [productId]: !prev[productId]
    }));
  };

  // Handle inline edit: enable editing mode
  const handleEditClick = (productId, field, currentValue, variantId = null) => {
    setEditingCell({ productId, variantId, field });
    setEditedValue(currentValue);
  };

  // Handle inline edit: save value on blur or enter
  const handleSaveEdit = (productId, field, variantId = null) => {
    if (!editingCell || editedValue === String(editingCell.currentValue)) {
      setEditingCell(null);
      return;
    }

    let updateData = {};
    if (variantId) {
      updateData = { [field]: editedValue };
    } else {
      updateData = { [field]: editedValue };
    }
    
    updateProductMutation.mutate({ productId, updateData });
  };

  // Handle key press for inline edit (Enter to save, Esc to cancel)
  const handleKeyDown = (e, productId, field, variantId = null) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      handleSaveEdit(productId, field, variantId);
    } else if (e.key === 'Escape') {
      setEditingCell(null);
    }
  };

  // Handle product status toggle (Active/Inactive)
  const handleStatusToggle = (productId, currentStatus) => {
    const newStatus = !currentStatus;
    updateProductMutation.mutate({ productId, updateData: { isActive: newStatus } });
  };

  // Handle product deletion
  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      deleteProductMutation.mutate(productId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <span className="loading loading-spinner loading-lg"></span>
      </div>
    );
  }
  if (isError) {
    return <div className="text-red-500 text-center">Error: {error.message}</div>;
  }
  if (!products || products.length === 0) {
    return <div className="p-6 bg-white rounded-lg shadow-md"><p>You haven't added any products yet.</p></div>;
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-6 bg-white rounded-lg shadow-md"
    >
      <h1 className="text-3xl font-bold text-gray-800 mb-6">My Products</h1>
      
      {/* Bulk Actions (Placeholder) */}
      <div className="mb-4 flex items-center space-x-2">
        <input type="checkbox" className="checkbox" />
        <span className="text-gray-600">0 products selected</span>
        <button className="btn btn-sm btn-outline btn-warning">Deactivate</button>
        <button className="btn btn-sm btn-outline btn-error">Delete</button>
        <button className="btn btn-sm btn-outline">Export Selected</button>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full">
          <thead>
            <tr>
              <th></th>
              <th>Product Info</th>
              <th>Price</th>
              <th>Stock</th>
              <th>Active</th>
              <th>Content Score</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            <AnimatePresence>
              {products.map(product => (
                <React.Fragment key={product._id}>
                  <motion.tr
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 20 }}
                    transition={{ duration: 0.3 }}
                    className="hover:bg-gray-50"
                  >
                    <td><input type="checkbox" className="checkbox" /></td>
                    <td className="flex items-center space-x-3 py-4">
                      <div className="avatar">
                        <div className="mask mask-squircle w-16 h-16">
                          <img src={product.images[0]} alt={product.productName} />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold">{product.productName}</div>
                        <div className="text-sm opacity-50">
                          {product.category}
                        </div>
                        <div className="text-xs text-gray-500 mt-1 flex items-center space-x-2">
                          <FaEye /> 0 <FaShoppingBag className="ml-2" /> 0 <FaDollarSign className="ml-2" /> 0
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap">
                      {editingCell?.productId === product._id && editingCell?.field === 'price' ? (
                        <input
                          ref={inputRef}
                          type="number"
                          step="0.01"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                          onBlur={() => handleSaveEdit(product._id, 'price')}
                          onKeyDown={(e) => handleKeyDown(e, product._id, 'price')}
                          className="input input-sm w-24"
                        />
                      ) : (
                        <span onClick={() => handleEditClick(product._id, 'price', product.price)} className="cursor-pointer hover:bg-gray-200 px-2 py-1 rounded">
                          ৳ {product.price?.toFixed(2)} <FaEdit className="inline-block ml-1 text-xs" />
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap">
                      {editingCell?.productId === product._id && editingCell?.field === 'stock' ? (
                        <input
                          ref={inputRef}
                          type="number"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                          onBlur={() => handleSaveEdit(product._id, 'stock')}
                          onKeyDown={(e) => handleKeyDown(e, product._id, 'stock')}
                          className="input input-sm w-20"
                        />
                      ) : (
                        <span onClick={() => handleEditClick(product._id, 'stock', product.stock)} className="cursor-pointer hover:bg-gray-200 px-2 py-1 rounded">
                          {product.stock} <FaEdit className="inline-block ml-1 text-xs" />
                        </span>
                      )}
                    </td>
                    <td>
                      <input
                        type="checkbox"
                        className="toggle toggle-success"
                        checked={product.status === 'published'}
                        onChange={() => handleStatusToggle(product._id, product.status === 'published')}
                        disabled={updateProductMutation.isPending}
                      />
                    </td>
                    <td>
                      <span className="text-green-600 flex items-center">
                        <FaCheckCircle className="mr-1" /> Excellent
                      </span>
                    </td>
                    <td>
                      <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-xs">
                          Edit <FaChevronDown className="ml-1" />
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-36">
                          <li><a href={`/dashboard/edit-product/${product._id}`}>Edit Product</a></li>
                          <li><a onClick={() => handleDeleteProduct(product._id)} className="text-red-500">Delete</a></li>
                        </ul>
                      </div>
                    </td>
                  </motion.tr>

                  {/* Variants Display */}
                  {product.variants && product.variants.length > 0 && (
                    <motion.tr
                      key={`${product._id}-variants-toggle`}
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.3 }}
                      className="bg-gray-50"
                    >
                      <td></td>
                      <td colSpan="6">
                        <button
                          className="text-sm text-blue-600 hover:underline flex items-center"
                          onClick={() => toggleVariants(product._id)}
                        >
                          {expandedVariants[product._id] ? (
                            <> <FaChevronUp className="mr-1" /> See Less Variants </>
                          ) : (
                            <> <FaChevronDown className="mr-1" /> See {product.variants.length} More Variants </>
                          )}
                        </button>
                      </td>
                    </motion.tr>
                  )}
                  
                  {expandedVariants[product._id] && product.variants && product.variants.length > 0 && (
                    <AnimatePresence>
                      {product.variants.map((variant, vIndex) => (
                        <motion.tr
                          key={`${product._id}-variant-${vIndex}`}
                          initial={{ opacity: 0, height: 0 }}
                          animate={{ opacity: 1, height: 'auto' }}
                          exit={{ opacity: 0, height: 0 }}
                          transition={{ duration: 0.3 }}
                          className="bg-gray-50 border-t border-gray-100"
                        >
                          <td></td>
                          <td className="flex items-center space-x-3 py-2 pl-6">
                            <div className="avatar">
                              <div className="mask mask-squircle w-12 h-12">
                                <img src={product.images[0]} alt={variant.color} /> 
                              </div>
                            </div>
                            <div>
                              <div className="font-semibold">{product.productName} ({variant.color})</div>
                              <div className="text-sm opacity-50">SKU: {variant.sellerSku}</div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap">
                            {editingCell?.productId === product._id && editingCell?.variantId === vIndex && editingCell?.field === 'variantPrice' ? (
                              <input
                                ref={inputRef}
                                type="number"
                                step="0.01"
                                value={editedValue}
                                onChange={(e) => setEditedValue(e.target.value)}
                                onBlur={() => handleSaveEdit(product._id, `variants.${vIndex}.variantPrice`, vIndex)}
                                onKeyDown={(e) => handleKeyDown(e, product._id, `variants.${vIndex}.variantPrice`, vIndex)}
                                className="input input-sm w-24"
                              />
                            ) : (
                              <span onClick={() => handleEditClick(product._id, 'variantPrice', variant.variantPrice, vIndex)} className="cursor-pointer hover:bg-gray-200 px-2 py-1 rounded">
                                ৳ {variant.variantPrice?.toFixed(2) || product.price?.toFixed(2)} <FaEdit className="inline-block ml-1 text-xs" />
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap">
                            {editingCell?.productId === product._id && editingCell?.variantId === vIndex && editingCell?.field === 'variantStock' ? (
                              <input
                                ref={inputRef}
                                type="number"
                                value={editedValue}
                                onChange={(e) => setEditedValue(e.target.value)}
                                onBlur={() => handleSaveEdit(product._id, `variants.${vIndex}.variantStock`, vIndex)}
                                onKeyDown={(e) => handleKeyDown(e, product._id, `variants.${vIndex}.variantStock`, vIndex)}
                                className="input input-sm w-20"
                              />
                            ) : (
                              <span onClick={() => handleEditClick(product._id, 'variantStock', variant.variantStock, vIndex)} className="cursor-pointer hover:bg-gray-200 px-2 py-1 rounded">
                                {variant.variantStock} <FaEdit className="inline-block ml-1 text-xs" />
                              </span>
                            )}
                          </td>
                          <td colSpan="3">
                          </td>
                        </motion.tr>
                      ))}
                    </AnimatePresence>
                  )}
                </React.Fragment>
              ))}
            </AnimatePresence>
          </tbody>
        </table>
      </div>
    </motion.div>
  );
};

export default MyProducts;