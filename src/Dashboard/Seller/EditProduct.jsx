import React, { useState, useContext, useEffect, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useForm, useFieldArray } from 'react-hook-form';
import { AuthContext } from '../../Context/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { imageUpload } from '../../API/utilis';
import toast from 'react-hot-toast';
import { motion, AnimatePresence } from 'framer-motion';
import { FaPlus, FaMinus, FaTimesCircle } from 'react-icons/fa';
import Swal from 'sweetalert2';

// Define constants outside the component for better readability and to prevent re-creation
const CATEGORIES_DATA = [
    { group: "Sound Equipment", items: ["Earphone", "Neckband", "Earbuds", "Overhead Headphone", "Wireless Headphone", "Wired Headphone", "Bluetooth speaker", "Smart speaker"] },
    { group: "Watch & Fitness", items: ["Smart Watch", "Classic Watch", "Couple Watch", "Watch Strap"] },
    { group: "Computer Accessories", items: ["Mouse Wireless", "Mouse Wired", "Keyboard Wireless", "Keyboard Wired", "USB/Hub/Multiplag", "Laptop Stand", "Laptop Bag"] },
    { group: "Smart Electronics", items: ["Lighting", "Cooling Fan", "Trimmer", "Blender", "Table Lamp", "Mini Iron", "Mixer machine"] },
    { group: "Seasonal Products", items: ["Umbrella", "Shoes"] },
    { group: "Bags", items: ["Ladies Bag", "College Bag", "Travel Bag", "Laptop Bag", "Vanity Bag"] },
];

const MAX_IMAGE_SIZE_MB = 1;

const EditProduct = () => {
    const { id } = useParams();
    const { user, loading: userLoading } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const queryClient = useQueryClient();
    const navigate = useNavigate();

    // Helper functions for parsing MongoDB Extended JSON numbers, memoized
    const parseNumber = useCallback((value) => {
        if (typeof value === 'object' && value !== null && (value?.$numberInt !== undefined || value?.$numberDouble !== undefined)) {
            return parseFloat(value.$numberInt || value.$numberDouble);
        }
        return value !== null && value !== undefined ? parseFloat(value) : undefined;
    }, []);

    const parseIntValue = useCallback((value) => {
        if (typeof value === 'object' && value !== null && (value?.$numberInt !== undefined || value?.$numberDouble !== undefined)) {
            return parseInt(value.$numberInt || value.$numberDouble);
        }
        return value !== null && value !== undefined ? parseInt(value) : undefined;
    }, []);

    // 1. Fetch existing product data using React Query
    const { data: product, isLoading: isProductLoading, isError: isProductError, error: productError } = useQuery({
        queryKey: ['productDetails', id],
        queryFn: async () => {
            const { data } = await axiosSecure.get(`/product/${id}`);
            return data;
        },
        enabled: !!id, // Only run query if ID is available
    });

    // React Hook Form setup
    const { register, handleSubmit, control, formState: { errors }, reset, watch, setValue } = useForm();
    const { fields, append, remove } = useFieldArray({
        control,
        name: "variants",
    });

    const [loading, setLoading] = useState(false);
    const [existingImages, setExistingImages] = useState([]); // To manage existing images {url, public_id}
    const [newImageFiles, setNewImageFiles] = useState([]); // To manage newly selected files
    const [newImagePreviews, setNewImagePreviews] = useState([]); // Previews for newly selected files

    // Set initial form values when product data is fetched
    useEffect(() => {
        if (product && user && product.sellerEmail === user.email) {
            // Determine if category is custom
            const isCustomCategory = !CATEGORIES_DATA.some(group => group.items.includes(product.category));

            reset({
                productName: product.productName,
                category: isCustomCategory ? 'Other / Custom' : product.category,
                customCategory: isCustomCategory ? product.category : '',
                brand: product.brand,
                videoUrl: product.videoUrl,
                model: product.specifications?.model,
                material: product.specifications?.material,
                price: parseNumber(product.price),
                specialPrice: parseNumber(product.specialPrice),
                stock: parseIntValue(product.stock),
                description: product.description,
                weight: parseNumber(product.shippingInfo?.weight),
                length: parseNumber(product.shippingInfo?.length),
                width: parseNumber(product.shippingInfo?.width),
                height: parseNumber(product.shippingInfo?.height),
                isDangerous: product.shippingInfo?.isDangerous ? 'yes' : 'no',
                warrantyType: product.warrantyInfo?.type,
                warrantyPeriod: product.warrantyInfo?.period,
                status: product.status,
                variants: product.variants?.map(v => ({
                    color: v.color,
                    variantPrice: parseNumber(v.variantPrice),
                    variantSpecialPrice: parseNumber(v.variantSpecialPrice),
                    variantStock: parseIntValue(v.variantStock),
                    sellerSku: v.sellerSku,
                })) || [{ color: '', variantPrice: '', variantSpecialPrice: '', variantStock: '', sellerSku: '' }],
            });
            setExistingImages(product.images || []);
        }
    }, [product, reset, user, parseNumber, parseIntValue]);

    // Watch selected category to conditionally show custom category input
    const selectedCategory = watch("category");

    // Handle new image file selection, memoized
    const handleNewImageFilesChange = useCallback((e) => {
        const files = Array.from(e.target.files);
        setNewImageFiles(files);
        setNewImagePreviews([]);

        if (files.length === 0) {
            return;
        }

        const validFiles = files.filter(file => {
            const isValid = file.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024;
            if (!isValid) {
                toast.error(`New file "${file.name}" is larger than ${MAX_IMAGE_SIZE_MB}MB and will be skipped.`);
            }
            return isValid;
        });

        if (validFiles.length === 0 && files.length > 0) {
            toast.error(`No valid new image files selected for preview. Please select files under ${MAX_IMAGE_SIZE_MB}MB.`);
            return;
        }

        const currentPreviews = [];
        validFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                currentPreviews.push(reader.result);
                if (currentPreviews.length === validFiles.length) {
                    setNewImagePreviews(currentPreviews);
                }
            };
            reader.readAsDataURL(file);
        });
    }, []);

    // Remove existing image from the list (client-side only for form submission), memoized
    const handleRemoveExistingImage = useCallback((imageToRemove) => {
        setExistingImages(prev => prev.filter(image => image.public_id !== imageToRemove.public_id));
        toast.success('Image removed from current selection. Save to apply changes.');
    }, []);

    // Form validation for images (overall for existing + new files), memoized
    const validateCombinedImages = useCallback(() => {
        if (existingImages.length === 0 && newImageFiles.length === 0) {
            return 'At least one product image is required.';
        }
        for (const file of newImageFiles) {
            if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
                return `New file "${file.name}" is larger than ${MAX_IMAGE_SIZE_MB}MB. Max size is ${MAX_IMAGE_SIZE_MB}MB per image.`;
            }
        }
        return true;
    }, [existingImages, newImageFiles]);

    // Mutation for updating product
    const updateProductMutation = useMutation({
        mutationFn: async (updatedProductData) => {
            const { data } = await axiosSecure.put(`/seller/product/${id}`, updatedProductData);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['productDetails', id] }); // Re-fetch single product
            queryClient.invalidateQueries({ queryKey: ['myProducts', user?.email] }); // Re-fetch seller's product list
            toast.success('Product updated successfully!');
            navigate('/dashboard/my-products'); // Navigate back to product list
        },
        onError: (error) => {
            console.error("Error updating product:", error);
            toast.error(error.response?.data?.message || 'Failed to update product.');
        },
    });

    // Mutation for deleting product
    const deleteProductMutation = useMutation({
        mutationFn: async () => {
            const { data } = await axiosSecure.delete(`/seller/product/${id}`);
            return data;
        },
        onSuccess: () => {
            queryClient.invalidateQueries({ queryKey: ['myProducts', user?.email] });
            toast.success('Product deleted successfully, including its images!');
            navigate('/dashboard/my-products'); // Navigate back to product list
        },
        onError: (error) => {
            console.error("Error deleting product:", error);
            toast.error(error.response?.data?.message || 'Failed to delete product.');
        },
    });

    // Handle product deletion (with SweetAlert confirmation)
    const handleDeleteProduct = useCallback(() => {
        Swal.fire({
            title: "Are you sure?",
            text: "You won't be able to revert this! This product and all associated images will be permanently deleted.",
            icon: "warning",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, delete it!"
        }).then((result) => {
            if (result.isConfirmed) {
                deleteProductMutation.mutate();
            } else {
                Swal.fire("Cancelled", "Your product is safe!", "error");
            }
        });
    }, [deleteProductMutation]);


    const onSubmit = async (data) => {
        Swal.fire({
            title: "Confirm Update?",
            text: "Are you sure you want to save all changes to this product?",
            icon: "question",
            showCancelButton: true,
            confirmButtonColor: "#3085d6",
            cancelButtonColor: "#d33",
            confirmButtonText: "Yes, update it!"
        }).then(async (result) => {
            if (result.isConfirmed) {
                setLoading(true);
                try {
                    const finalCategory = data.category === 'Other / Custom' ? data.customCategory : data.category;
                    if (!finalCategory) {
                        toast.error('Please select or enter a category.');
                        setLoading(false);
                        return;
                    }

                    const newlyUploadedImageData = [];
                    if (newImageFiles.length > 0) {
                        for (const imageFile of newImageFiles) {
                            if (imageFile.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024) {
                                try {
                                    const imageData = await imageUpload(imageFile);
                                    newlyUploadedImageData.push(imageData);
                                } catch (uploadError) {
                                    toast.error(`Image upload failed for ${imageFile.name}. Skipping.`);
                                }
                            }
                        }
                    }

                    const finalImageUrls = [...existingImages, ...newlyUploadedImageData];

                    if (finalImageUrls.length === 0) {
                        toast.error("At least one product image is required after editing.");
                        setLoading(false);
                        return;
                    }

                    const updatedProductData = {
                        productName: data.productName,
                        category: finalCategory,
                        price: parseFloat(data.price),
                        specialPrice: data.specialPrice ? parseFloat(data.specialPrice) : undefined, // Use undefined for null if optional
                        stock: parseInt(data.stock),
                        description: data.description,
                        brand: data.brand || 'Generic',
                        images: finalImageUrls, // Combined existing (retained) and new images
                        videoUrl: data.videoUrl || undefined,
                        status: data.status,

                        sellerEmail: user?.email,
                        sellerUid: user?.uid,
                        sellerName: user?.displayName || "Unknown Seller",

                        specifications: {
                            model: data.model || undefined,
                            material: data.material || undefined,
                        },
                        variants: data.variants
                            .filter(v => v.color) // Only include variants with a color
                            .map(v => ({
                                color: v.color,
                                variantPrice: v.variantPrice ? parseFloat(v.variantPrice) : undefined,
                                variantSpecialPrice: v.variantSpecialPrice ? parseFloat(v.variantSpecialPrice) : undefined,
                                variantStock: v.variantStock ? parseInt(v.variantStock) : undefined,
                                sellerSku: v.sellerSku || undefined,
                            })),

                        shippingInfo: {
                            weight: data.weight ? parseFloat(data.weight) : undefined,
                            length: data.length ? parseFloat(data.length) : undefined,
                            width: data.width ? parseFloat(data.width) : undefined,
                            height: data.height ? parseFloat(data.height) : undefined,
                            isDangerous: data.isDangerous === 'yes',
                        },
                        warrantyInfo: {
                            type: data.warrantyType || undefined,
                            period: data.warrantyPeriod || undefined,
                        },
                    };

                    updateProductMutation.mutate(updatedProductData);

                } catch (error) {
                    console.error("Error submitting product update:", error);
                    const errorMessage = error.response?.data?.message || 'An unexpected error occurred during submission.';
                    toast.error(errorMessage);
                } finally {
                    setLoading(false);
                }
            } else {
                Swal.fire("Cancelled", "Your product update was cancelled.", "error");
            }
        });
    };

    // Render loading/error states for product data fetch
    if (userLoading || isProductLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <span className="loading loading-spinner loading-lg"></span>
            </div>
        );
    }
    if (isProductError) {
        return (
            <div className="min-h-screen flex items-center justify-center text-red-500">
                Error fetching product: {productError.message}
            </div>
        );
    }
    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center text-gray-600">
                Product not found.
            </div>
        );
    }

    // Client-side ownership check (crucial if server-side verification is minimal)
    if (user && product.sellerEmail !== user.email) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center text-red-500 text-center p-4">
                <h2 className="text-3xl font-bold mb-4">Access Denied!</h2>
                <p className="text-lg">You do not have permission to edit this product as you are not the seller.</p>
                <button onClick={() => navigate('/dashboard/my-products')} className="mt-6 btn btn-primary">
                    Go to My Products
                </button>
            </div>
        );
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-8 bg-white rounded-lg shadow-md max-w-4xl mx-auto"
        >
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Edit Product</h1>
            <p className="text-gray-600 text-center mb-8">
                Editing product: <span className="font-semibold text-blue-600">{product.productName} (ID: {id})</span>
            </p>

            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
                {/* Basic Information */}
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">Basic Information</h2>
                <div>
                    <label htmlFor="productName" className="block text-gray-700 font-semibold mb-2">Product Name</label>
                    <input
                        type="text"
                        id="productName"
                        {...register('productName', { required: 'Product Name is required' })}
                        className="input input-bordered w-full"
                        placeholder="e.g., Elegant Leather Handbag"
                    />
                    {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName.message}</p>}
                </div>
                <div>
                    <label htmlFor="category" className="block text-gray-700 font-semibold mb-2">Category</label>
                    <select
                        id="category"
                        {...register('category', { required: 'Category is required' })}
                        className="select select-bordered w-full"
                    >
                        <option value="">Select a category</option>
                        {CATEGORIES_DATA.map((group, index) => (
                            <optgroup key={index} label={group.group}>
                                {group.items.map((item) => (
                                    <option key={item} value={item}>{item}</option>
                                ))}
                            </optgroup>
                        ))}
                        <option value="Other / Custom">Other / Custom Category</option>
                    </select>
                    {errors.category && <p className="text-red-500 text-sm mt-1">{errors.category.message}</p>}
                </div>
                {selectedCategory === 'Other / Custom' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="overflow-hidden"
                    >
                        <label htmlFor="customCategory" className="block text-gray-700 font-semibold mb-2">Custom Category Name</label>
                        <input
                            type="text"
                            id="customCategory"
                            {...register('customCategory', { required: 'Custom Category Name is required' })}
                            className="input input-bordered w-full"
                            placeholder="e.g., Home Decor"
                        />
                        {errors.customCategory && <p className="text-red-500 text-sm mt-1">{errors.customCategory.message}</p>}
                    </motion.div>
                )}
                <div>
                    <label htmlFor="brand" className="block text-gray-700 font-semibold mb-2">Brand (Optional)</label>
                    <input
                        type="text"
                        id="brand"
                        {...register('brand')}
                        className="input input-bordered w-full"
                        placeholder="e.g., AFENADAISHU"
                    />
                </div>

                {/* Product Images & Video */}
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">Images & Video</h2>
                {/* Existing Images Display */}
                {existingImages.length > 0 && (
                    <div className="mb-4">
                        <label className="block text-gray-700 font-semibold mb-2">Current Images (Click ✖ to remove):</label>
                        <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-5 gap-3">
                            <AnimatePresence>
                                {existingImages.map((image, index) => (
                                    <motion.div
                                        key={image.public_id || image.url || `existing-${index}`} // Use public_id as key
                                        initial={{ opacity: 0, scale: 0.9 }}
                                        animate={{ opacity: 1, scale: 1 }}
                                        exit={{ opacity: 0, scale: 0.9 }}
                                        transition={{ duration: 0.2 }}
                                        className="relative w-full aspect-square object-cover rounded-lg shadow-sm group"
                                    >
                                        <img src={image.url} alt={`Existing ${index}`} className="w-full h-full object-cover rounded-lg" />
                                        <button
                                            type="button"
                                            onClick={() => handleRemoveExistingImage(image)}
                                            className="absolute top-1 right-1 p-1 bg-red-500 text-white rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center w-5 h-5"
                                            title="Remove image from product"
                                        >
                                            <FaTimesCircle />
                                        </button>
                                    </motion.div>
                                ))}
                            </AnimatePresence>
                        </div>
                    </div>
                )}
                <div>
                    <label htmlFor="newProductImages" className="block text-gray-700 font-semibold mb-2">Add New Product Images (Max {MAX_IMAGE_SIZE_MB}MB each)</label>
                    <input
                        type="file"
                        id="newProductImages"
                        multiple
                        accept="image/*"
                        {...register('newProductImages', { validate: validateCombinedImages })}
                        onChange={handleNewImageFilesChange}
                        className="file-input file-input-bordered w-full"
                    />
                    {errors.newProductImages && <p className="text-red-500 text-sm mt-1">{errors.newProductImages.message}</p>}

                    {newImagePreviews.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {newImagePreviews.map((src, index) => (
                                <img key={index} src={src} alt={`New Preview ${index}`} className="w-full h-24 object-cover rounded-lg shadow-sm" />
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <label htmlFor="videoUrl" className="block text-gray-700 font-semibold mb-2">Product Video URL (Optional)</label>
                    <input
                        type="url"
                        id="videoUrl"
                        {...register('videoUrl', {
                            pattern: {
                                value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|googleusercontent\.com\/youtube\.com)\/.+$/,
                                message: 'Please enter a valid YouTube video URL or Googleusercontent YouTube URL.'
                            }
                        })}
                        className="input input-bordered w-full"
                        placeholder="e.g., https://www.youtube.com/watch?v=..."
                    />
                    {errors.videoUrl && <p className="text-red-500 text-sm mt-1">{errors.videoUrl.message}</p>}
                </div>


                {/* Product Specification (Basic example) */}
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">Product Specification</h2>
                <div>
                    <label htmlFor="model" className="block text-gray-700 font-semibold mb-2">Model (Optional)</label>
                    <input type="text" id="model" {...register('model')} className="input input-bordered w-full" placeholder="e.g., Model X123" />
                </div>
                <div>
                    <label htmlFor="material" className="block text-gray-700 font-semibold mb-2">Material (Optional)</label>
                    <input type="text" id="material" {...register('material')} className="input input-bordered w-full" placeholder="e.g., PU Leather, Ceramic" />
                </div>

                {/* Price, Stock & Variants */}
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4">Pricing & Stock</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="price" className="block text-gray-700 font-semibold mb-2">Base Price (৳)</label>
                        <input
                            type="number"
                            id="price"
                            step="0.01"
                            {...register('price', {
                                required: 'Base Price is required',
                                min: { value: 1, message: 'Price must be at least ৳1' },
                                valueAsNumber: true // Ensure number type
                            })}
                            className="input input-bordered w-full"
                            placeholder="e.g., 2200.00"
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="specialPrice" className="block text-gray-700 font-semibold mb-2">Special Price (৳ Optional)</label>
                        <input
                            type="number"
                            id="specialPrice"
                            step="0.01"
                            {...register('specialPrice', {
                                valueAsNumber: true, // Ensure number type
                                validate: (value) => {
                                    const basePrice = parseFloat(watch('price'));
                                    if (value && basePrice && value >= basePrice) {
                                        return 'Special Price must be less than Base Price.';
                                    }
                                    return true;
                                }
                            })}
                            className="input input-bordered w-full"
                            placeholder="e.g., 1999.00 (for discount)"
                        />
                        {errors.specialPrice && <p className="text-red-500 text-sm mt-1">{errors.specialPrice.message}</p>}
                    </div>
                </div>
                <div>
                    <label htmlFor="stock" className="block text-gray-700 font-semibold mb-2">Total Stock Quantity</label>
                    <input
                        type="number"
                        id="stock"
                        {...register('stock', {
                            required: 'Total Stock quantity is required',
                            min: { value: 0, message: 'Stock cannot be negative' },
                            valueAsNumber: true // Ensure number type
                        })}
                        className="input input-bordered w-full"
                        placeholder="e.g., 50"
                    />
                    {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
                </div>

                {/* Dynamic Variants (Color Option) */}
                <h3 className="text-xl font-semibold text-gray-800 mt-6 mb-4">Color Variants</h3>
                {fields.map((field, index) => (
                    <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end border p-4 rounded-lg bg-gray-50 relative mb-4"
                    >
                        <div className="md:col-span-1">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Color</label>
                            <input
                                type="text"
                                {...register(`variants.${index}.color`, { required: 'Color is required for variant' })}
                                className="input input-bordered w-full"
                                placeholder="e.g., Red, Blue"
                            />
                            {errors.variants?.[index]?.color && <p className="text-red-500 text-sm mt-1">{errors.variants[index].color.message}</p>}
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Variant Price</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register(`variants.${index}.variantPrice`, { valueAsNumber: true })}
                                className="input input-bordered w-full"
                                placeholder="Optional"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Variant Special Price</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register(`variants.${index}.variantSpecialPrice`, {
                                    valueAsNumber: true,
                                    validate: (value) => {
                                        const variantPrice = watch(`variants.${index}.variantPrice`);
                                        if (value && variantPrice && value >= variantPrice) {
                                            return 'Special Price must be less than Variant Price.';
                                        }
                                        return true;
                                    }
                                })}
                                className="input input-bordered w-full"
                                placeholder="Optional"
                            />
                            {errors.variants?.[index]?.variantSpecialPrice && <p className="text-red-500 text-sm mt-1">{errors.variants[index].variantSpecialPrice.message}</p>}
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Variant Stock</label>
                            <input
                                type="number"
                                {...register(`variants.${index}.variantStock`, { valueAsNumber: true })}
                                className="input input-bordered w-full"
                                placeholder="Optional"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Seller SKU</label>
                            <input
                                type="text"
                                {...register(`variants.${index}.sellerSku`)}
                                className="input input-bordered w-full"
                                placeholder="e.g., BAG-RED-001"
                            />
                        </div>
                        <div className="md:col-span-1 flex justify-center items-center mt-2 md:mt-0">
                            {fields.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="btn btn-error btn-sm w-full text-white"
                                >
                                    <FaMinus /> Remove
                                </button>
                            )}
                        </div>
                    </motion.div>
                ))}
                <button
                    type="button"
                    onClick={() => append({ color: '', variantPrice: '', variantSpecialPrice: '', variantStock: '', sellerSku: '' })}
                    className="btn btn-outline btn-info w-full"
                >
                    <FaPlus /> Add New Color Variant
                </button>

                {/* Product Description */}
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4 mt-6">Product Description</h2>
                <div>
                    <label htmlFor="description" className="block text-gray-700 font-semibold mb-2">Description</label>
                    <textarea
                        id="description"
                        rows="5"
                        {...register('description', {
                            required: 'Product description is required',
                            minLength: { value: 20, message: 'Description must be at least 20 characters' }
                        })}
                        className="textarea textarea-bordered w-full"
                        placeholder="Provide a detailed description of your product..."
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                {/* Shipping & Warranty */}
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4 mt-6">Shipping & Warranty</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="weight" className="block text-gray-700 font-semibold mb-2">Package Weight (kg)</label>
                        <input
                            type="number"
                            id="weight"
                            step="0.01"
                            {...register('weight', { valueAsNumber: true })}
                            className="input input-bordered w-full"
                            placeholder="e.g., 0.5 (kg)"
                        />
                    </div>
                    <div>
                        <label htmlFor="dimensions" className="block text-gray-700 font-semibold mb-2">Package Dimensions (cm: L x W x H)</label>
                        <div className="grid grid-cols-3 gap-2">
                            <input type="number" step="0.01" {...register('length', { valueAsNumber: true })} className="input input-bordered" placeholder="Length" />
                            <input type="number" step="0.01" {...register('width', { valueAsNumber: true })} className="input input-bordered" placeholder="Width" />
                            <input type="number" step="0.01" {...register('height', { valueAsNumber: true })} className="input input-bordered" placeholder="Height" />
                        </div>
                    </div>
                </div>
                <div className="form-control">
                    <label className="label cursor-pointer justify-start">
                        <span className="label-text text-gray-700 font-semibold mr-4">Dangerous Goods?</span>
                        <input type="radio" {...register('isDangerous')} value="yes" className="radio mr-2" /> Yes
                        <input type="radio" {...register('isDangerous')} value="no" className="radio ml-4" defaultChecked /> No
                    </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                        <label htmlFor="warrantyType" className="block text-gray-700 font-semibold mb-2">Warranty Type (Optional)</label>
                        <input type="text" id="warrantyType" {...register('warrantyType')} className="input input-bordered w-full" placeholder="e.g., Brand Warranty, Seller Warranty" />
                    </div>
                    <div>
                        <label htmlFor="warrantyPeriod" className="block text-gray-700 font-semibold mb-2">Warranty Period (Optional)</label>
                        <input type="text" id="warrantyPeriod" {...register('warrantyPeriod')} className="input input-bordered w-full" placeholder="e.g., 1 Year, 6 Months" />
                    </div>
                </div>

                {/* Status */}
                <h2 className="text-2xl font-semibold text-gray-800 border-b pb-2 mb-4 mt-6">Publish Status</h2>
                <div>
                    <label htmlFor="status" className="block text-gray-700 font-semibold mb-2">Status</label>
                    <select
                        id="status"
                        {...register('status', { required: 'Status is required' })}
                        className="select select-bordered w-full"
                    >
                        <option value="pending">Pending</option>
                        <option value="published">Published</option>
                        <option value="draft">Draft</option>
                    </select>
                    {errors.status && <p className="text-red-500 text-sm mt-1">{errors.status.message}</p>}
                </div>

                {/* Submit Button */}
                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn w-full bg-gradient-to-r from-blue-500 to-indigo-600 text-white font-bold py-3 rounded-lg shadow-lg hover:from-blue-600 hover:to-indigo-700 transition duration-300 mt-8"
                    disabled={loading || updateProductMutation.isPending}
                >
                    {(loading || updateProductMutation.isPending) ? 'Updating Product...' : 'Update Product'}
                </motion.button>
            </form>
            {/* Delete Button */}
            <motion.button
                type="button"
                onClick={handleDeleteProduct}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className="btn w-full bg-red-600 text-white font-bold py-3 rounded-lg shadow-lg hover:bg-red-700 transition duration-300 mt-4"
                disabled={deleteProductMutation.isPending}
            >
                {deleteProductMutation.isPending ? 'Deleting...' : 'Delete Product'}
            </motion.button>
        </motion.div>
    );
};

export default EditProduct;