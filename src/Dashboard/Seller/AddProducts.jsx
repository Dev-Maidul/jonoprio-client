import React, { useState, useContext } from 'react';
import { useForm, useFieldArray } from 'react-hook-form';
import { AuthContext } from '../../Context/AuthProvider';
import useAxiosSecure from '../../hooks/useAxiosSecure';
import { imageUpload } from '../../API/utilis';
import toast from 'react-hot-toast';
import { motion } from 'framer-motion';
import { FaPlus, FaMinus } from 'react-icons/fa';

const categoriesData = [
    { group: "Sound Equipment", items: ["Earphone", "Neckband", "Earbuds", "Overhead Headphone", "Wireless Headphone", "Wired Headphone", "Bluetooth speaker", "Smart speaker"] },
    { group: "Watch & Fitness", items: ["Smart Watch", "Classic Watch", "Couple Watch", "Watch Strap"] },
    { group: "Computer Accessories", items: ["Mouse Wireless", "Mouse Wired", "Keyboard Wireless", "Keyboard Wired", "USB/Hub/Multiplag", "Laptop Stand", "Laptop Bag"] },
    { group: "Smart Electronics", items: ["Lighting", "Cooling Fan", "Trimmer", "Blender", "Table Lamp", "Mini Iron", "Mixer machine"] },
    { group: "Seasonal Products", items: ["Umbrella", "Shoes"] },
    { group: "Bags", items: ["Ladies Bag", "College Bag", "Travel Bag", "Laptop Bag", "Vanity Bag"] },
];

const AddProduct = () => {
    const { user } = useContext(AuthContext);
    const axiosSecure = useAxiosSecure();
    const { register, handleSubmit, control, formState: { errors }, reset, watch, setValue } = useForm({
        defaultValues: {
            variants: [{ color: '', variantPrice: '', variantSpecialPrice: '', variantStock: '', sellerSku: '' }],
            isDangerous: 'no', // Default for radio button
        }
    });
    const { fields, append, remove } = useFieldArray({
        control,
        name: "variants",
    });

    const [loading, setLoading] = useState(false);
    const [imagePreviews, setImagePreviews] = useState([]);
    const [videoPreview, setVideoPreview] = useState(null);

    // Watch selected category to conditionally show custom category input
    const selectedCategory = watch("category");

    const handleImageChange = (e) => {
        const files = Array.from(e.target.files);
        setImagePreviews([]); // Clear previous previews
        
        if (files.length > 0) {
            const newPreviews = [];
            files.forEach((file) => {
                if (file.size > 1 * 1024 * 1024) { // Check file size (1MB)
                    toast.error(`File "${file.name}" is larger than 1MB and will be skipped.`);
                    return; 
                }
                const reader = new FileReader();
                reader.onloadend = () => {
                    newPreviews.push(reader.result);
                    if (newPreviews.length === files.length - files.filter(f => f.size > 1 * 1024 * 1024).length) {
                        setImagePreviews([...newPreviews]);
                    }
                };
                reader.readAsDataURL(file);
            });
        } else {
            setImagePreviews([]);
        }
    };

    const validateImageFiles = (files) => {
        if (!files || files.length === 0) {
            return 'At least one image is required.';
        }
        for (const file of files) {
            if (file.size > 1 * 1024 * 1024) { // 1MB limit
                return `File "${file.name}" is larger than 1MB. Max size is 1MB per image.`;
            }
        }
        return true;
    };

    const onSubmit = async (data) => {
        setLoading(true);
        try {
            // Determine final category
            const finalCategory = data.category === 'Other / Custom' ? data.customCategory : data.category;
            if (!finalCategory) {
                toast.error('Please select or enter a category.');
                setLoading(false);
                return;
            }

            // 1. Upload Images
            const imageUrls = [];
            if (data.productImages && data.productImages.length > 0) {
                for (const imageFile of Array.from(data.productImages)) {
                    if (imageFile.size <= 1 * 1024 * 1024) { // Re-check size before uploading
                        try {
                            const url = await imageUpload(imageFile);
                            imageUrls.push(url);
                        } catch (uploadError) {
                            toast.error(`Image upload failed for ${imageFile.name}. Skipping this image.`);
                        }
                    }
                }
            }
            if (imageUrls.length === 0 && data.productImages.length > 0) {
                 toast.error("No images could be uploaded successfully. Please ensure they are under 1MB.");
                 setLoading(false);
                 return;
            } else if (imageUrls.length === 0 && (!data.productImages || data.productImages.length === 0)) {
                 toast.error("Please upload at least one image.");
                 setLoading(false);
                 return;
            }


            // 2. Prepare Product Data
            const productData = {
                productName: data.productName,
                category: finalCategory, // Use determined category
                price: parseFloat(data.price),
                specialPrice: data.specialPrice ? parseFloat(data.specialPrice) : null,
                stock: parseInt(data.stock),
                description: data.description,
                brand: data.brand || 'Generic',
                images: imageUrls,
                videoUrl: data.videoUrl || null,
                status: data.status,
                
                // ADDED FIX: Explicitly adding seller info from the user context
                sellerEmail: user?.email,
                sellerUid: user?.uid,
                sellerName: user?.displayName || "Unknown Seller",

                specifications: {
                    model: data.model || null,
                    material: data.material || null,
                },
                variants: data.variants.map(v => ({
                    color: v.color,
                    variantPrice: v.variantPrice ? parseFloat(v.variantPrice) : null,
                    variantSpecialPrice: v.variantSpecialPrice ? parseFloat(v.variantSpecialPrice) : null,
                    variantStock: v.variantStock ? parseInt(v.variantStock) : null,
                    sellerSku: v.sellerSku || null,
                })).filter(v => v.color), // Filter out empty variant rows

                shippingInfo: {
                    weight: data.weight ? parseFloat(data.weight) : null,
                    length: data.length ? parseFloat(data.length) : null,
                    width: data.width ? parseFloat(data.width) : null,
                    height: data.height ? parseFloat(data.height) : null,
                    isDangerous: data.isDangerous === 'yes' ? true : false,
                },
                warrantyInfo: {
                    type: data.warrantyType || null,
                    period: data.warrantyPeriod || null,
                },
            };

            // 3. Send data to backend
            const response = await axiosSecure.post('/seller/product', productData);

            if (response.data.insertedId) {
                toast.success('Product added successfully!');
                reset(); // Clear form fields
                setImagePreviews([]); // Clear image previews
                setVideoPreview(null); // Clear video preview
                // FIXED: Reset variants using setValue
                setValue('variants', [{ color: '', variantPrice: '', variantSpecialPrice: '', variantStock: '', sellerSku: '' }]);
            } else {
                toast.error('Failed to add product.');
            }

        } catch (error) {
            console.error("Error adding product:", error);
            if (error.response && error.response.data && error.response.data.message) {
                toast.error(error.response.data.message);
            } else {
                toast.error('An unexpected error occurred.');
            }
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="p-6 bg-white rounded-lg shadow-md max-w-4xl mx-auto"
        >
            <h1 className="text-3xl font-bold text-gray-800 mb-6 text-center">Add New Product</h1>
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
                        {categoriesData.map((group, index) => (
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
                        transition={{ duration: 0.3 }}
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
                <div>
                    <label htmlFor="productImages" className="block text-gray-700 font-semibold mb-2">Main Product Images (Max 1MB each)</label>
                    <input
                        type="file"
                        id="productImages"
                        multiple
                        accept="image/*"
                        {...register('productImages', { validate: validateImageFiles })}
                        onChange={(e) => {
                            handleImageChange(e);
                        }}
                        className="file-input file-input-bordered w-full"
                    />
                    {errors.productImages && <p className="text-red-500 text-sm mt-1">{errors.productImages.message}</p>}
                    
                    {imagePreviews.length > 0 && (
                        <div className="mt-4 grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-2">
                            {imagePreviews.map((src, index) => (
                                <img key={index} src={src} alt={`Preview ${index}`} className="w-full h-24 object-cover rounded-lg shadow-sm" />
                            ))}
                        </div>
                    )}
                </div>
                <div>
                    <label htmlFor="videoUrl" className="block text-gray-700 font-semibold mb-2">Product Video URL (Optional)</label>
                    <input
                        type="url"
                        id="videoUrl"
                        {...register('videoUrl')}
                        className="input input-bordered w-full"
                        placeholder="e.g., https://www.youtube.com/watch?v=xxxxxxxxxx"
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
                                min: { value: 1, message: 'Price must be at least ৳1' }
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
                            {...register('specialPrice')}
                            className="input input-bordered w-full"
                            placeholder="e.g., 1999.00 (for discount)"
                        />
                    </div>
                </div>
                <div>
                    <label htmlFor="stock" className="block text-gray-700 font-semibold mb-2">Total Stock Quantity</label>
                    <input
                        type="number"
                        id="stock"
                        {...register('stock', {
                            required: 'Total Stock quantity is required',
                            min: { value: 0, message: 'Stock cannot be negative' }
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
                                {...register(`variants.${index}.variantPrice`)}
                                className="input input-bordered w-full"
                                placeholder="Optional"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Variant Special Price</label>
                            <input
                                type="number"
                                step="0.01"
                                {...register(`variants.${index}.variantSpecialPrice`)}
                                className="input input-bordered w-full"
                                placeholder="Optional"
                            />
                        </div>
                        <div className="md:col-span-1">
                            <label className="block text-gray-700 text-sm font-semibold mb-2">Variant Stock</label>
                            <input
                                type="number"
                                {...register(`variants.${index}.variantStock`)}
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
                            {...register('weight')}
                            className="input input-bordered w-full"
                            placeholder="e.g., 0.5 (kg)"
                        />
                    </div>
                    <div>
                        <label htmlFor="dimensions" className="block text-gray-700 font-semibold mb-2">Package Dimensions (cm: L x W x H)</label>
                        <div className="grid grid-cols-3 gap-2">
                            <input type="number" step="0.01" {...register('length')} className="input input-bordered" placeholder="Length" />
                            <input type="number" step="0.01" {...register('width')} className="input input-bordered" placeholder="Width" />
                            <input type="number" step="0.01" {...register('height')} className="input input-bordered" placeholder="Height" />
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
                        defaultValue="published"
                    >
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
                    disabled={loading}
                >
                    {loading ? 'Adding Product...' : 'Add Product'}
                </motion.button>
            </form>
        </motion.div>
    );
};

export default AddProduct;