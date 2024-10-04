import { v2 as cloudinary } from "cloudinary";
import fs from "node:fs";
import logger from "./logger.js";
import pLimit from "p-limit";
import { maximumImagecount } from "../constants/constants.js";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

// function to upload only image
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
  const publicIdWithExtension = urlParts[urlParts.length - 1]; // e.g., "z83zw3dgvazincpfhxns.jpg"
  const publicId = publicIdWithExtension.split(".")[0]; // remove extension, e.g., "z83zw3dgvazincpfhxns"

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

const limit = pLimit(maximumImagecount);
// function to upload multiple images
const uploadMultipleOnCloudinary = (fileArrayLocalPath) => {
  return fileArrayLocalPath.map((image) => {
    return limit(async () => {
      const result = await cloudinary.uploader.upload(image);
      return result;
    });
  });
};

// deleting multiple images from cloudinary
const deleteMultipleFromClodinary = async (ArrayOfPublicIdOfImages) => {
  try {
    const result = await cloudinary.api.delete_resources(
      ArrayOfPublicIdOfImages
    );

    return result;
  } catch (error) {
    logger.error("Error in deleting image from Cloudinary", error);
    return null;
  }
};

export {
  uploadOnCloudinary,
  deleteFromCloudinary,
  uploadMultipleOnCloudinary,
  deleteMultipleFromClodinary,
};
