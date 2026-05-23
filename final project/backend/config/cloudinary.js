// config/cloudinary.js
import { v2 as cloudinary } from "cloudinary";

const cloudinaryConfig = () => {
  cloudinary.config({
    cloud_name: process.env.CLOUDINARY_NAME,
    api_key: process.env.CLOUDINARY_API_KEY,
    api_secret: process.env.CLOUDINARY_SECRET,
  });
  console.log("Cloudinary configured ✅");
};

export default cloudinaryConfig;
export { cloudinary }; // ✅ Important for uploader