import React, { useState, useContext, useCallback } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { AuthContext } from '../../Context/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { imageUpload } from '../../API/utilis';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaPlus, FaMinus } from 'react-icons/fa';

const CATEGORIES_DATA = [
    { group: "Sound Equipment", items: ["Earphone", "Neckband", "Earbuds", "Overhead Headphone", "Wireless Headphone", "Wired Headphone", "Bluetooth speaker", "Smart speaker"] },
    { group: "Watch & Fitness", items: ["Smart Watch", "Classic Watch", "Couple Watch", "Watch Strap"] },
    { group: "Computer Accessories", items: ["Mouse Wireless", "Mouse Wired", "Keyboard Wireless", "Keyboard Wired", "USB/Hub/Multiplag", "Laptop Stand", "Laptop Bag"] },
    { group: "Smart Electronics", items: ["Lighting", "Cooling Fan", "Trimmer", "Blender", "Table Lamp", "Mini Iron", "Mixer machine"] },
    { group: "Seasonal Products", items: ["Umbrella", "Shoes"] },
    { group: "Bags", items: ["Ladies Bag", "College Bag", "Travel Bag", "Laptop Bag", "Vanity Bag"] },
];

const MAX_IMAGE_SIZE_MB = 1;

const AddProduct = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const {
        register,
        handleSubmit,
        control,
        formState: { errors },
        reset,
        watch,
        setValue
    } = useForm({
        defaultValues: {
            variants: [{ color: '', variantPrice: '', variantSpecialPrice: '', variantStock: '', sellerSku: '' }],
            isDangerous: 'no',
            status: 'pending',
        }
    });

    const { fields, append, remove } = useFieldArray({
        control,
        name: "variants",
    });

    const [loading, setLoading] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);

    const selectedCategory = watch("category");

    const handleImageChange = useCallback((e) => {
        const files = Array.from(e.target.files);
        setImagePreviews([]); 
        
        if (files.length === 0) {
            return;
        }

        const validFiles = files.filter(file => {
            const isValid = file.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024;
            if (!isValid) {
                toast.error(`File "${file.name}" is larger than ${MAX_IMAGE_SIZE_MB}MB and will be skipped.`);
            }
            return isValid;
        });

        if (validFiles.length === 0 && files.length > 0) {
            toast.error(`No valid image files selected. Please select files under ${MAX_IMAGE_SIZE_MB}MB.`);
            return;
        }

        const newPreviews = [];
        validFiles.forEach((file) => {
            const reader = new FileReader();
            reader.onloadend = () => {
                newPreviews.push(reader.result);
                if (newPreviews.length === validFiles.length) {
                    setImagePreviews(newPreviews);
                }
            };
            reader.readAsDataURL(file);
        });
    }, []);

    const validateImageFiles = useCallback((files) => {
        if (!files || files.length === 0) {
            return 'At least one image is required.';
        }
        for (const file of files) {
            if (file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) {
                return `File "${file.name}" is larger than ${MAX_IMAGE_SIZE_MB}MB. Max size is ${MAX_IMAGE_SIZE_MB}MB per image.`;
            }
        }
        return true;
    }, []);

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            const finalCategory = data.category === 'Other / Custom' ? data.customCategory : data.category;
            if (!finalCategory) {
                toast.error('Please select or enter a category.');
                setLoading(false);
                return;
            }

            const uploadedImages = [];
            if (data.productImages && data.productImages.length > 0) {
                for (const imageFile of Array.from(data.productImages)) {
                    if (imageFile.size <= MAX_IMAGE_SIZE_MB * 1024 * 1024) {
                        try {
                            const imageData = await imageUpload(imageFile);
                            uploadedImages.push(imageData);
                        } catch (uploadError) {
                            console.error(`Image upload failed for ${imageFile.name}:`, uploadError);
                            toast.error(`Image upload failed for ${imageFile.name}. Skipping.`);
                        }
                    }
                }
            }

            if (uploadedImages.length === 0 && (!data.productImages || data.productImages.length === 0)) {
                toast.error("Please upload at least one image.");
                setLoading(false);
                return;
            } else if (uploadedImages.length === 0 && data.productImages.length > 0) {
                 toast.error(`No images could be uploaded successfully. Ensure they are under ${MAX_IMAGE_SIZE_MB}MB.`);
                 setLoading(false);
                 return;
            }


            const productData = {
                productName: data.productName,
                category: finalCategory,
                price: parseFloat(data.price),
                specialPrice: data.specialPrice ? parseFloat(data.specialPrice) : undefined,
                stock: parseInt(data.stock),
                description: data.description,
                brand: data.brand || 'Generic',
                images: uploadedImages,
                videoUrl: data.videoUrl || undefined,
                status: 'pending',

                sellerEmail: user?.email,
                sellerUid: user?.uid,
                sellerName: user?.displayName || "Unknown Seller",
                createdAt: new Date().toISOString(),

                specifications: {
                    model: data.model || undefined,
                    material: data.material || undefined,
                },
                variants: data.variants
                    .filter(v => v.color)
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
                initiallyOrdered: 0,
                avgRating: 0,
                reviewCount: 0,
                isFeatured: false,
                isNewArrival: true,
            };

            const response = await axiosSecure.post('/seller/product', productData);

            if (response.data.insertedId) {
                toast.success('Product added successfully and is awaiting admin approval!');
                reset();
                setImagePreviews([]);
                setValue('variants', [{ color: '', variantPrice: '', variantSpecialPrice: '', variantStock: '', sellerSku: '' }]);
            } else {
                toast.error('Failed to add product.');
            }

        } catch (error) {
            console.error("Error adding product:", error);
            const errorMessage = error.response?.data?.message || 'An unexpected error occurred.';
            toast.error(errorMessage);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="p-8 bg-gradient-to-br from-gray-50 to-gray-100 rounded-2xl shadow-2xl max-w-5xl mx-auto"
        >
            <h1 className="text-4xl font-extrabold text-gray-900 mb-8 text-center border-b-4 border-teal-600 pb-4">Add New Product</h1>
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-8">
                {/* Basic Information */}
                <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-3 mb-6">Basic Information</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="productName" className="block text-lg font-medium text-gray-700 mb-2">Product Name</label>
                        <input
                            type="text"
                            id="productName"
                            {...register('productName', { required: 'Product Name is required' })}
                            className="input input-bordered w-full bg-white rounded-md focus:border-teal-600 focus:ring-teal-600"
                            placeholder="e.g., Elegant Leather Handbag"
                        />
                        {errors.productName && <p className="text-red-500 text-sm mt-1">{errors.productName.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="category" className="block text-lg font-medium text-gray-700 mb-2">Category</label>
                        <select
                            id="category"
                            {...register('category', { required: 'Category is required' })}
                            className="select select-bordered w-full bg-white rounded-md focus:border-teal-600 focus:ring-teal-600"
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
                </div>
                {selectedCategory === 'Other / Custom' && (
                    <motion.div
                        initial={{ opacity: 0, height: 0 }}
                        animate={{ opacity: 1, height: 'auto' }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        className="overflow-hidden"
                    >
                        <label htmlFor="customCategory" className="block text-lg font-medium text-gray-700 mb-2">Custom Category Name</label>
                        <input
                            type="text"
                            id="customCategory"
                            {...register('customCategory', { required: 'Custom Category Name is required' })}
                            className="input input-bordered w-full bg-white rounded-md focus:border-teal-600 focus:ring-teal-600"
                            placeholder="e.g., Home Decor"
                        />
                        {errors.customCategory && <p className="text-red-500 text-sm mt-1">{errors.customCategory.message}</p>}
                    </motion.div>
                )}
                <div>
                    <label htmlFor="brand" className="block text-lg font-medium text-gray-700 mb-2">Brand (Optional)</label>
                    <input
                        type="text"
                        id="brand"
                        {...register('brand')}
                        className="input input-bordered w-full bg-white rounded-md focus:border-teal-600 focus:ring-teal-600"
                        placeholder="e.g., AFENADAISHU"
                    />
                </div>

                {/* Product Images & Video */}
                <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-3 mb-6">Images & Video</h2>
                <div>
                    <label htmlFor="productImages" className="block text-lg font-medium text-gray-700 mb-2">Main Product Images (Max {MAX_IMAGE_SIZE_MB}MB each)</label>
                    <input
                        type="file"
                        id="productImages"
                        multiple
                        accept="image/*"
                        {...register('productImages', { validate: validateImageFiles })}
                        onChange={handleImageChange}
                        className="file-input file-input-bordered w-full bg-white rounded-md focus:border-teal-600 focus:ring-teal-600"
                    />
                    {errors.productImages && <p className="text-red-500 text-sm mt-1">{errors.productImages.message}</p>}

                    {imagePreviews.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                            {imagePreviews.map((src, index) => (
                                <img key={index} src={src} alt={`Preview ${index}`} className="w-full h-32 object-cover rounded-xl shadow-md" />
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <label htmlFor="videoUrl" className="block text-lg font-medium text-gray-700 mb-2">Product Video URL (Optional)</label>
                    <input
                        type="url"
                        id="videoUrl"
                        {...register('videoUrl', {
                            pattern: {
                                value: /^(https?:\/\/)?(www\.)?(youtube\.com|youtu\.be|googleusercontent\.com\/youtube\.com)\/.+$/,
                                message: 'Please enter a valid YouTube video URL or Googleusercontent YouTube URL.'
                            }
                        })}
                        className="input input-bordered w-full bg-white rounded-md focus:border-teal-600 focus:ring-teal-600"
                        placeholder="e.g., https://www.youtube.com/watch?v=..."
                    />
                    {errors.videoUrl && <p className="text-red-500 text-sm mt-1">{errors.videoUrl.message}</p>}
                </div>

                {/* Product Specification (Basic example) */}
                <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-3 mb-6">Product Specification</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="model" className="block text-lg font-medium text-gray-700 mb-2">Model (Optional)</label>
                        <input type="text" id="model" {...register('model')} className="input input-bordered w-full bg-white rounded-md focus:border-teal-600 focus:ring-teal-600" placeholder="e.g., Model X123" />
                    </div>
                    <div>
                        <label htmlFor="material" className="block text-lg font-medium text-gray-700 mb-2">Material (Optional)</label>
                        <input type="text" id="material" {...register('material')} className="input input-bordered w-full bg-white rounded-md focus:border-teal-600 focus:ring-teal-600" placeholder="e.g., PU Leather, Ceramic" />
                    </div>
                </div>

                {/* Price, Stock & Variants */}
                <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-3 mb-6">Pricing & Stock</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="price" className="block text-lg font-medium text-gray-700 mb-2">Base Price (৳)</label>
                        <input
                            type="number"
                            id="price"
                            step="0.01"
                            {...register('price', {
                                required: 'Base Price is required',
                                min: { value: 1, message: 'Price must be at least ৳1' },
                                valueAsNumber: true // Ensure number type
                            })}
                            className="input input-bordered w-full bg-white rounded-md focus:border-teal-600 focus:ring-teal-600"
                            placeholder="e.g., 2200.00"
                        />
                        {errors.price && <p className="text-red-500 text-sm mt-1">{errors.price.message}</p>}
                    </div>
                    <div>
                        <label htmlFor="specialPrice" className="block text-lg font-medium text-gray-700 mb-2">Special Price (৳ Optional)</label>
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
                            className="input input-bordered w-full bg-white rounded-md focus:border-teal-600 focus:ring-teal-600"
                            placeholder="e.g., 1999.00 (for discount)"
                        />
                        {errors.specialPrice && <p className="text-red-500 text-sm mt-1">{errors.specialPrice.message}</p>}
                    </div>
                </div>
                <div>
                    <label htmlFor="stock" className="block text-lg font-medium text-gray-700 mb-2">Total Stock Quantity</label>
                    <input
                        type="number"
                        id="stock"
                        {...register('stock', {
                            required: 'Total Stock quantity is required',
                            min: { value: 0, message: 'Stock cannot be negative' },
                            valueAsNumber: true // Ensure number type
                        })}
                        className="input input-bordered w-full bg-white rounded-md focus:border-teal-600 focus:ring-teal-600"
                        placeholder="e.g., 50"
                    />
                    {errors.stock && <p className="text-red-500 text-sm mt-1">{errors.stock.message}</p>}
                </div>

                {/* Dynamic Variants (Color Option) */}
                <h3 className="text-xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-3 mb-6">Color Variants</h3>
                {fields.map((field, index) => (
                    <motion.div
                        key={field.id}
                        initial={{ opacity: 0, y: -10 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ duration: 0.3, delay: 0.1 }}
                        exit={{ opacity: 0, y: -10 }}
                        className="grid grid-cols-1 md:grid-cols-6 gap-4 items-end border p-5 rounded-xl bg-gray-50 relative mb-6 shadow-md"
                    >
                        <div className="md:col-span-1">
                            <label className="block text-md font-medium text-gray-700 mb-2">Color</label>
                            <input
                                type="text"
                                {...register(`variants.${index}.color`, { required: 'Color is required for variant' })}
                                className="input input-bordered w-full bg-white rounded-md focus:border-teal-600 focus:ring-teal-600"
                                placeholder="e.g., Red, Blue"
                            />
                            {errors.variants?.[index]?.color && <p className="text-red-500 text-sm mt-1">{errors.variants[index].color.message}</p>}
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-md font-medium text-gray-700 mb-2">Variant Price</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register(`variants.${index}.variantPrice`, { valueAsNumber: true })}
                                className="input input-bordered w-full bg-white rounded-md focus:border-teal-600 focus:ring-teal-600"
                                placeholder="Optional"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-md font-medium text-gray-700 mb-2">Variant Special Price</label>
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
                                className="input input-bordered w-full bg-white rounded-md focus:border-teal-600 focus:ring-teal-600"
                                placeholder="Optional"
                            />
                            {errors.variants?.[index]?.variantSpecialPrice && <p className="text-red-500 text-sm mt-1">{errors.variants[index].variantSpecialPrice.message}</p>}
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-md font-medium text-gray-700 mb-2">Variant Stock</label>
                            <input
                                type="number"
                                {...register(`variants.${index}.variantStock`, { valueAsNumber: true })}
                                className="input input-bordered w-full bg-white rounded-md focus:border-teal-600 focus:ring-teal-600"
                                placeholder="Optional"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-md font-medium text-gray-700 mb-2">Seller SKU</label>
                            <input
                                type="text"
                                {...register(`variants.${index}.sellerSku`)}
                                className="input input-bordered w-full bg-white rounded-md focus:border-teal-600 focus:ring-teal-600"
                                placeholder="e.g., BAG-RED-001"
                            />
                        </div>
                        <div className="md:col-span-1 flex justify-center items-center mt-2 md:mt-0">
                            {fields.length > 1 && (
                                <button
                                    type="button"
                                    onClick={() => remove(index)}
                                    className="btn btn-error btn-sm w-full text-white rounded-md"
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
                    className="btn btn-outline btn-info w-full rounded-md text-lg"
                >
                    <FaPlus /> Add New Color Variant
                </button>

                {/* Product Description */}
                <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-3 mb-6">Product Description</h2>
                <div>
                    <label htmlFor="description" className="block text-lg font-medium text-gray-700 mb-2">Description</label>
                    <textarea
                        id="description"
                        rows="5"
                        {...register('description', {
                            required: 'Product description is required',
                            minLength: { value: 20, message: 'Description must be at least 20 characters' }
                        })}
                        className="textarea textarea-bordered w-full bg-white rounded-md focus:border-teal-600 focus:ring-teal-600"
                        placeholder="Provide a detailed description of your product..."
                    ></textarea>
                    {errors.description && <p className="text-red-500 text-sm mt-1">{errors.description.message}</p>}
                </div>

                {/* Shipping & Warranty */}
                <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-3 mb-6">Shipping & Warranty</h2>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="weight" className="block text-lg font-medium text-gray-700 mb-2">Package Weight (kg)</label>
                        <input
                            type="number"
                            id="weight"
                            step="0.01"
                            {...register('weight', { valueAsNumber: true })}
                            className="input input-bordered w-full bg-white rounded-md focus:border-teal-600 focus:ring-teal-600"
                            placeholder="e.g., 0.5 (kg)"
                        />
                    </div>
                    <div>
                        <label htmlFor="dimensions" className="block text-lg font-medium text-gray-700 mb-2">Package Dimensions (cm: L x W x H)</label>
                        <div className="grid grid-cols-3 gap-4">
                            <input type="number" step="0.01" {...register('length', { valueAsNumber: true })} className="input input-bordered bg-white rounded-md focus:border-teal-600 focus:ring-teal-600" placeholder="Length" />
                            <input type="number" step="0.01" {...register('width', { valueAsNumber: true })} className="input input-bordered bg-white rounded-md focus:border-teal-600 focus:ring-teal-600" placeholder="Width" />
                            <input type="number" step="0.01" {...register('height', { valueAsNumber: true })} className="input input-bordered bg-white rounded-md focus:border-teal-600 focus:ring-teal-600" placeholder="Height" />
                        </div>
                    </div>
                </div>
                <div className="form-control">
                    <label className="label cursor-pointer justify-start">
                        <span className="label-text text-lg font-medium text-gray-700 mr-4">Dangerous Goods?</span>
                        <input type="radio" {...register('isDangerous')} value="yes" className="radio mr-2" /> Yes
                        <input type="radio" {...register('isDangerous')} value="no" className="radio ml-4" defaultChecked /> No
                    </label>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                        <label htmlFor="warrantyType" className="block text-lg font-medium text-gray-700 mb-2">Warranty Type (Optional)</label>
                        <input type="text" id="warrantyType" {...register('warrantyType')} className="input input-bordered w-full bg-white rounded-md focus:border-teal-600 focus:ring-teal-600" placeholder="e.g., Brand Warranty, Seller Warranty" />
                    </div>
                    <div>
                        <label htmlFor="warrantyPeriod" className="block text-lg font-medium text-gray-700 mb-2">Warranty Period (Optional)</label>
                        <input type="text" id="warrantyPeriod" {...register('warrantyPeriod')} className="input input-bordered w-full bg-white rounded-md focus:border-teal-600 focus:ring-teal-600" placeholder="e.g., 1 Year, 6 Months" />
                    </div>
                </div>

                {/* Status */}
                <h2 className="text-2xl font-semibold text-gray-800 border-b-2 border-gray-300 pb-3 mb-6">Publish Status</h2>
                <p className="text-gray-700 text-md">The product status will be set to "Pending" upon submission and will be visible on the All Products page after admin approval.</p>
                <input type="hidden" {...register('status')} value="pending" />

                {/* Submit Button */}
                <motion.button
                    type="submit"
                    whileHover={{ scale: 1.02 }}
                    whileTap={{ scale: 0.98 }}
                    className="btn w-full bg-gradient-to-r from-teal-500 to-teal-700 text-white font-bold py-4 rounded-xl shadow-xl hover:from-teal-600 hover:to-teal-800 transition duration-300 mt-10"
                    disabled={loading}
                >
                    {loading ? 'Adding Product...' : 'Add Product'}
                </motion.button>
            </form>
        </motion.div>
    );
};

export default AddProduct;