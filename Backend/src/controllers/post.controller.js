import { Post } from "../models/post.model.js";
import fs from "node:fs";


import {
    asyncHandler,
    apiError,
    apiResponse,
} from '../utils/index.js'

import { uploadMultipleOnCloudinary } from "../utils/cloudinary.js";

import logger from "../utils/logger.js";

const createPost = asyncHandler(async (req, res) => {
    const { content, theme } = req.body;
    const fileArray = req.files;

    let postimgs = [];
    // uploading images if user has provided images
    if (fileArray.length > 0) {
        const fileArrayLocalPath = fileArray.map((image) => image.path);
        try {
            // Await the upload results
            const uploadPromises = uploadMultipleOnCloudinary(fileArrayLocalPath);
            const results = await Promise.all(uploadPromises);

            if (!results) throw new apiError(500, "Failed to upload images")

            // creating postimgs which is an array of object, object has: public_id and secure_url as key
            postimgs = results.map((result) => {
                return {
                    public_id: result?.public_id,  //public id of image from cloudinary
                    secure_url: result?.secure_url // secure_url of image from cloudinary
                }
            })

        } catch (error) {
            logger.error("Error uploading post images:", error);
            throw new apiError(
                error?.statusCode || 500,
                error?.message || "Failed to upload images",
            );
        } finally {
            // removing all files - both scenario [image uploaded or not uploaded to cloudinary]
            fileArrayLocalPath.map((localFile) => {
                fs.unlinkSync(localFile, (err) => {
                    if (err) logger.error("File couldn't be deleted from server");
                });
            })
        }

    }

    const newPost = await Post.create({
        user: req?.user?._id,
        content,
        postimgs,
        theme
    })
    // upload images to cloudinary
    res.status(200).json(new apiResponse(200, newPost, "Successfully created the post"))
})

export {
    createPost,
}
