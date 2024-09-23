import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";
import logger from "./logger.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

const uploadOnCloudinary = async (localFilePath) => {
  try {
    if (!localFilePath) return null;

    const uploadResponse = await cloudinary.uploader.upload(localFilePath, {
      resource_type: "auto",
    });

    // removing files if file has been successfully uploaded in the cloudinary
    fs.unlinkSync(localFilePath, (err) => {
      if (err) logger.error("File couldn't be deleted from server");
    });

    return uploadResponse;
  } catch (error) {
    logger.error("Error in image upload on cloudinary", error);
    // deleting file even if there is error in uploadinf file in cloudinary
    fs.unlinkSync(localFilePath, (err) => {
      if (err) logger.error("File couldn't be deleted from server");
    });

    return null;
  }
};

const extractPublicIdFromUrl = (imageUrl) => {
  const urlParts = imageUrl.split("/");
  // The public_id is the last part of the URL (before the extension)
  const publicIdWithExtension = urlParts[urlParts.length - 1]; // e.g., "v1631026197.jpg"
  const publicId = publicIdWithExtension.split(".")[0]; // remove extension, e.g., "v1631026197"

  return publicId;
};

// Function to delete image from Cloudinary
const deleteFromCloudinary = async (imageUrl) => {
  try {
    const publicId = extractPublicIdFromUrl(imageUrl);
    const result = await cloudinary.uploader.destroy(publicId);

    if (result.result !== "ok") {
      logger.error(`Failed to delete image: ${result.result}`);
      return null;
    }

    return result;
  } catch (error) {
    logger.error("Error in deleting image from Cloudinary", error);
    return null;
  }
};

export { uploadOnCloudinary, deleteFromCloudinary };
