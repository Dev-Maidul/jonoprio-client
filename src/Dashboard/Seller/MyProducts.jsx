import React, { useState, useContext, useRef, useEffect } from 'react';
import { AuthContext } from '../../Context/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaEdit, FaTrash, FaChevronDown, FaChevronUp, FaEye, FaShoppingBag, FaDollarSign, FaTimesCircle, FaCheckCircle } from 'react-icons/fa';
import { Link } from 'react-router-dom';

const MyProducts = () => {
  const { user } = useContext(AuthContext);
  const axiosSecure = useAxiosSecure();
  const queryClient = useQueryClient();

  const [expandedVariants, setExpandedVariants] = useState({});
  const [editingCell, setEditingCell] = useState(null);
  const [editedValue, setEditedValue] = useState('');
  const inputRef = useRef(null);

  // Fallback image (replace with your own base64 or URL)
  const FALLBACK_IMAGE = 'data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAAAEAAAABCAYAAAAfFcSJAAAAC0lEQVR42mNkAAIAAAoAAv/lxKUAAAAASUVORK5CYII='; // 1x1 pixel gray square

  // Helper function to safely parse numeric values from MongoDB Extended JSON
  const parseNumber = (value) => {
    if (typeof value === 'object' && value !== null && (value?.$numberInt !== undefined || value?.$numberDouble !== undefined)) {
      return parseFloat(value.$numberInt || value.$numberDouble);
    }
    return parseFloat(value) || 0;
  };
  
  const parseIntValue = (value) => {
    if (typeof value === 'object' && value !== null && (value?.$numberInt !== undefined || value?.$numberDouble !== undefined)) {
      return parseInt(value.$numberInt || value.$numberDouble);
    }
    return parseInt(value) || 0;
  };

  // Fetch seller's products
  const { data: products, isLoading, isError, error } = useQuery({
    queryKey: ['myProducts', user?.email],
    queryFn: async () => {
      if (!user?.email) return [];
      const { data } = await axiosSecure.get(`/seller/products/${user.email}`);
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
      const { data } = await axiosSecure.put(`/seller/product/${productId}`, updateData);
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
      const { data } = await axiosSecure.delete(`/seller/product/${productId}`);
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
    if (field.startsWith('variants.')) {
      updateData = { [field]: parseNumber(editedValue) };
    } else if (field === 'price' || field === 'stock') {
      updateData = { [field]: parseNumber(editedValue) };
    } else if (field === 'isActive') {
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
    const newDbStatus = newStatus ? 'published' : 'pending';
    updateProductMutation.mutate({ productId, updateData: { status: newDbStatus } });
  };

  // Handle product deletion
  const handleDeleteProduct = (productId) => {
    if (window.confirm("Are you sure you want to delete this product? This action cannot be undone.")) {
      deleteProductMutation.mutate(productId);
    }
  };

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <span className="loading loading-spinner loading-lg text-teal-600"></span>
      </div>
    );
  }
  if (isError) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-600 bg-gray-50">
        Error: {error.message}
      </div>
    );
  }
  if (!products || products.length === 0) {
    return (
      <div className="p-8 bg-white rounded-xl shadow-xl min-h-[250px] flex items-center justify-center border border-gray-200">
        <p className="text-gray-700 text-xl font-semibold">You haven't added any products yet.</p>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-xl shadow-2xl w-full"
    >
      <h1 className="text-4xl font-extrabold text-gray-900 mb-8 border-b-4 border-teal-600 pb-4">My Products</h1>
      
      {/* Bulk Actions */}
      <div className="flex items-center space-x-4 mb-8">
        <input type="checkbox" className="checkbox checkbox-primary rounded" />
        <span className="text-gray-600 font-medium text-lg">0 products selected</span>
        <button className="btn btn-sm btn-outline btn-warning text-orange-500 hover:bg-orange-500 hover:text-white rounded-md transition-colors">Deactivate</button>
        <button className="btn btn-sm btn-outline btn-error text-red-500 hover:bg-red-500 hover:text-white rounded-md transition-colors">Delete</button>
        <button className="btn btn-sm btn-outline text-gray-600 hover:bg-gray-100 rounded-md transition-colors">Export Selected</button>
      </div>

      <div className="overflow-x-auto">
        <table className="table w-full bg-white border border-gray-200 rounded-xl">
          <thead>
            <tr className="bg-gradient-to-r from-teal-600 to-teal-800 text-white uppercase text-sm leading-tight">
              <th className="py-4 px-6 text-left"></th>
              <th className="py-4 px-6 text-left">Product Info</th>
              <th className="py-4 px-6 text-left">Price</th>
              <th className="py-4 px-6 text-left">Stock</th>
              <th className="py-4 px-6 text-center">Active</th>
              <th className="py-4 px-6 text-center">Content Score</th>
              <th className="py-4 px-6 text-center">Actions</th>
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
                    className="hover:bg-gray-50 border-b border-gray-100"
                  >
                    <td className="py-4 px-6"><input type="checkbox" className="checkbox checkbox-sm checkbox-primary rounded" /></td>
                    <td className="flex items-center space-x-4 py-4 px-6">
                      <div className="avatar">
                        <div className="mask mask-squircle w-20 h-20">
                          <img 
                            src={product.images && product.images.length > 0 ? product.images[0] : FALLBACK_IMAGE} 
                            alt={product.productName} 
                            className="object-cover w-full h-full"
                            onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                          />
                        </div>
                      </div>
                      <div>
                        <div className="font-bold text-lg">
                          <Link to={`/product/${product._id}`} className="hover:text-teal-600 transition-colors duration-200">
                            {product.productName}
                          </Link>
                        </div>
                        <div className="text-sm opacity-70 text-gray-600">
                          {product.category}
                        </div>
                        <div className="text-xs text-gray-500 mt-2 flex items-center space-x-3">
                          <span className="flex items-center"><FaEye /> 0</span>
                          <span className="flex items-center"><FaShoppingBag className="ml-2" /> 0</span>
                          <span className="flex items-center"><FaDollarSign className="ml-2" /> 0</span>
                        </div>
                      </div>
                    </td>
                    <td className="whitespace-nowrap py-4 px-6">
                      {editingCell?.productId === product._id && editingCell?.field === 'price' ? (
                        <input
                          ref={inputRef}
                          type="number"
                          step="0.01"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                          onBlur={() => handleSaveEdit(product._id, 'price', null, parseNumber(product.price))}
                          onKeyDown={(e) => handleKeyDown(e, product._id, 'price', null, parseNumber(product.price))}
                          className="input input-sm w-28 bg-white rounded-md focus:border-teal-600 focus:ring-teal-600"
                        />
                      ) : (
                        <span onClick={() => handleEditClick(product._id, 'price', parseNumber(product.price))} className="cursor-pointer hover:bg-gray-200 px-3 py-1 rounded-md text-lg">
                          ৳ {parseNumber(product.price)?.toFixed(2)} <FaEdit className="inline-block ml-1 text-sm" />
                        </span>
                      )}
                    </td>
                    <td className="whitespace-nowrap py-4 px-6">
                      {editingCell?.productId === product._id && editingCell?.field === 'stock' ? (
                        <input
                          ref={inputRef}
                          type="number"
                          value={editedValue}
                          onChange={(e) => setEditedValue(e.target.value)}
                          onBlur={() => handleSaveEdit(product._id, 'stock', null, parseIntValue(product.stock))}
                          onKeyDown={(e) => handleKeyDown(e, product._id, 'stock', null, parseIntValue(product.stock))}
                          className="input input-sm w-24 bg-white rounded-md focus:border-teal-600 focus:ring-teal-600"
                        />
                      ) : (
                        <span onClick={() => handleEditClick(product._id, 'stock', parseIntValue(product.stock))} className="cursor-pointer hover:bg-gray-200 px-3 py-1 rounded-md text-lg">
                          {parseIntValue(product.stock)} <FaEdit className="inline-block ml-1 text-sm" />
                        </span>
                      )}
                    </td>
                    <td className="py-4 px-6 text-center">
                      <input
                        type="checkbox"
                        className="toggle toggle-success rounded-full"
                        checked={product.status === 'published'}
                        onChange={() => handleStatusToggle(product._id, product.status === 'published')}
                        disabled={updateProductMutation.isPending}
                      />
                    </td>
                    <td className="py-4 px-6 text-center">
                      <span className="inline-flex items-center px-3 py-1 rounded-full text-sm font-medium bg-green-100 text-green-800">
                        <FaCheckCircle className="mr-1" /> Excellent
                      </span>
                    </td>
                    <td className="py-4 px-6 text-center">
                      <div className="dropdown dropdown-end">
                        <div tabIndex={0} role="button" className="btn btn-ghost btn-sm rounded-md">
                          Edit <FaChevronDown className="ml-1" />
                        </div>
                        <ul tabIndex={0} className="dropdown-content z-[1] menu p-2 shadow-lg bg-white rounded-md w-40">
                          <li><Link to={`/dashboard/edit-product/${product._id}`} className="hover:bg-teal-100 rounded">Edit Product</Link></li>
                          <li><a onClick={() => handleDeleteProduct(product._id)} className="text-red-500 hover:bg-red-100 rounded">Delete</a></li>
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
                      className="bg-gray-50 border-b border-gray-100"
                    >
                      <td></td>
                      <td colSpan="6" className="py-2 px-6">
                        <button
                          className="text-md text-teal-600 hover:underline flex items-center font-medium"
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
                          className="bg-gray-50 border-t border-gray-100 hover:bg-gray-100"
                        >
                          <td className="py-2 px-6"></td>
                          <td className="flex items-center space-x-3 py-2 px-6 pl-14">
                            <div className="avatar">
                              <div className="mask mask-squircle w-12 h-12">
                                <img 
                                  src={product.images && product.images.length > 0 ? product.images[0] : FALLBACK_IMAGE} 
                                  alt={variant.color} 
                                  className="object-cover w-full h-full"
                                  onError={(e) => { e.target.src = FALLBACK_IMAGE; }}
                                />
                              </div>
                            </div>
                            <div>
                              <div className="font-semibold text-md">{product.productName} ({variant.color})</div>
                              <div className="text-sm opacity-70 text-gray-600">SKU: {variant.sellerSku}</div>
                            </div>
                          </td>
                          <td className="whitespace-nowrap py-2 px-6">
                            {editingCell?.productId === product._id && editingCell?.variantId === vIndex && editingCell?.field === 'variantPrice' ? (
                              <input
                                ref={inputRef}
                                type="number"
                                step="0.01"
                                value={editedValue}
                                onChange={(e) => setEditedValue(e.target.value)}
                                onBlur={() => handleSaveEdit(product._id, `variants.${vIndex}.variantPrice`, vIndex, parseNumber(variant.variantPrice))}
                                onKeyDown={(e) => handleKeyDown(e, product._id, `variants.${vIndex}.variantPrice`, vIndex, parseNumber(variant.variantPrice))}
                                className="input input-sm w-28 bg-white rounded-md focus:border-teal-600 focus:ring-teal-600"
                              />
                            ) : (
                              <span onClick={() => handleEditClick(product._id, 'variantPrice', parseNumber(variant.variantPrice), vIndex)} className="cursor-pointer hover:bg-gray-200 px-3 py-1 rounded-md text-md">
                                ৳ {parseNumber(variant.variantPrice)?.toFixed(2) || parseNumber(product.price)?.toFixed(2)} <FaEdit className="inline-block ml-1 text-sm" />
                              </span>
                            )}
                          </td>
                          <td className="whitespace-nowrap py-2 px-6">
                            {editingCell?.productId === product._id && editingCell?.variantId === vIndex && editingCell?.field === 'variantStock' ? (
                              <input
                                ref={inputRef}
                                type="number"
                                value={editedValue}
                                onChange={(e) => setEditedValue(e.target.value)}
                                onBlur={() => handleSaveEdit(product._id, `variants.${vIndex}.variantStock`, vIndex, parseIntValue(variant.variantStock))}
                                onKeyDown={(e) => handleKeyDown(e, product._id, `variants.${vIndex}.variantStock`, vIndex, parseIntValue(variant.variantStock))}
                                className="input input-sm w-24 bg-white rounded-md focus:border-teal-600 focus:ring-teal-600"
                              />
                            ) : (
                              <span onClick={() => handleEditClick(product._id, 'variantStock', parseIntValue(variant.variantStock), vIndex)} className="cursor-pointer hover:bg-gray-200 px-3 py-1 rounded-md text-md">
                                {parseIntValue(variant.variantStock)} <FaEdit className="inline-block ml-1 text-sm" />
                              </span>
                            )}
                          </td>
                          <td colSpan="3" className="py-2 px-6"></td>
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