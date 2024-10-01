import { Post } from "../models/post.model.js";
import { User } from "../models/user.model.js";
import fs from "node:fs";


import {
    asyncHandler,
    apiError,
    apiResponse,
} from '../utils/index.js'

import { uploadMultipleOnCloudinary, deleteMultipleFromClodinary } from "../utils/cloudinary.js";

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

    // Updating the user document by adding newly created post in his posts field
    const user = await User.findById(req.user._id);
    if (user) {
        user.posts.push(newPost._id);
        await user.save({ validateBeforeSave: false });
    }

    // upload images to cloudinary
    res.status(200).json(new apiResponse(200, newPost, "Successfully created the post"))
})

const getAllPosts = asyncHandler(async (req, res) => {

    // finding all posts
    const allPosts = await Post
        .find()
        .populate('user', '_id username profilepic')
        .populate('likedby', '_id username profilepic')
        .populate('dislikedby', '_id username profilepic')
        .sort({ updatedAt: -1 }); //sorting the post based on recently updated(or created) post


    return res.status(200).json(new apiResponse(200, allPosts, "Successfully fetched all posts data"))
})

const getUserPosts = asyncHandler(async (req, res) => {

    const userPosts = await Post
        .find({ user: req?.params?.userId })
        .populate('user', '_id username profilepic')
        .populate('likedby', '_id username profilepic')
        .populate('dislikedby', '_id username profilepic')
        .sort({ updatedAt: -1 }); //sorting the post based on recently updated(or created) post

    res.status(200).json(new apiResponse(200, userPosts, "Successfully fetched user's post"))

})

const deletePost = asyncHandler(async (req, res) => {
    const postId = req.params.postId;

    if (!postId) throw new apiError(400, "PostId not provided")

    const postToBeDeleted = await Post.findById(postId);

    if (!postToBeDeleted) throw new apiError(404, "Post Not Found");

    // deleting images from cloudinary
    if (postToBeDeleted?.postimgs.length > 0) {

        const imagesToBeDeleted = postToBeDeleted.postimgs.map((img) => { return img.public_id });

        deleteMultipleFromClodinary(imagesToBeDeleted)
            .then((result) => {
                // result can be an object or null
                if (result) logger.info("status of image deletion==>", result?.deleted);
                else logger.error("Error deleting image from Cloudinary==>", result)
            })
            .catch((error) => {
                logger.error("Error deleting image from Cloudinary==>", error)
            })
    }

    // deleting post
    const deletePost = await Post.findByIdAndDelete(postToBeDeleted._id);

    // Updating the user document by removing this recently deleted post from his posts array
    const user = await User.findById(req.user._id);
    if (user) {
        const index = user.posts.indexOf(deletePost._id);
        // only splice array when item is found
        if (index > -1) {
            user.posts.splice(index, 1);
        }
        await user.save({ validateBeforeSave: false });
    }

    if (!deletePost) return res.status(500).json(new apiError(500, "Cannot delete post at this moment"))

    return res.status(200).json(new apiResponse(204, {}, "Successfully deleted the post"))
})

const getSinglePost = asyncHandler(async (req, res) => {
    const postId = req?.params?.postId;

    if(!postId) throw new apiError(400, "Postid not provided");

    const post = await Post.findById(postId);

    if (!post) throw new apiError(404, "Post Not Found");

    return res.status(200).json(new apiResponse(200, post, "Successfully fetched post"))
})

export {
    createPost,
    getAllPosts,
    getUserPosts,
    deletePost,
    getSinglePost,
}
