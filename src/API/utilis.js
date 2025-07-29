import axios from "axios"

export const imageUpload = async (imageData) => {
  const formData = new FormData();

  // Append file and preset to formData
  formData.append('file', imageData);
  formData.append('upload_preset', import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET_UNSIGNED);
  formData.append('cloud_name', import.meta.env.VITE_CLOUDINARY_CLOUD_NAME);

  try {
    // Make the request to Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${import.meta.env.VITE_CLOUDINARY_CLOUD_NAME}/image/upload`,
      formData,
      {
        headers: {
          'Content-Type': 'multipart/form-data',
        },
      }
    );

    // Return the URL and public_id if the upload is successful
    return {
      url: response.data?.secure_url,
      public_id: response.data?.public_id,
    };
  } catch (error) {
    // Enhanced logging for better debugging
    console.error("Error uploading image to Cloudinary:", error.response?.data || error.message);

    // If the error has a response, log the error message and data
    if (error.response) {
      console.error("Error response data:", error.response.data);
      console.error("Error response status:", error.response.status);
    }

    // Throw the error to stop further processing
    throw new Error("Failed to upload image to Cloudinary.");
  }
};



// Save User Data to Database
export const saveUserInDb = async user => {
  const { data } = await axios.post(
    `${import.meta.env.VITE_API_URL}/user`,
    user
  )

  console.log(data)
}
