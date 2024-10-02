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

    if (!postId) throw new apiError(400, "Postid not provided");

    const post = await Post.findById(postId);

    if (!post) throw new apiError(404, "Post Not Found");

    return res.status(200).json(new apiResponse(200, post, "Successfully fetched post"))
})

const updatePost = asyncHandler(async (req, res) => {
    const postId = req?.params?.postId;
    const { content, theme, previousimgs = [] } = req.body;
    const fileArray = req.files;
    let newpostimgs = [];
    let imagesToBeDeleted = [];

    if (!postId) throw new apiError(400, "Postid not provided");

    const prevPost = await Post.findById(postId);

    if (!prevPost) throw new apiError(404, "Post Not Found");

    // here, previousimgs is an array of previous images, which user wants to keep
    // previous image is an array of string or urls
    // prevPost.postimgs is an array of object containing public id and secure_url
    if (previousimgs.length > 0 && prevPost?.postimgs?.length > 0) {
        prevPost.postimgs.forEach((img) => {
            if (previousimgs.includes(img.secure_url)) {
                newpostimgs.push(img)
            } else {
                imagesToBeDeleted.push(img.public_id)
            }
        });
    } else if (prevPost?.postimgs?.length > 0) {
        // here, all the previous images are supposed to be deleted
        imagesToBeDeleted = prevPost.postimgs.map((img) => { return img.public_id });
    }

    if (imagesToBeDeleted.length > 0) {
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

    // uploading images if user has provided images
    if (fileArray.length > 0) {
        const fileArrayLocalPath = fileArray.map((image) => image.path);
        try {
            // Await the upload results
            const uploadPromises = uploadMultipleOnCloudinary(fileArrayLocalPath);
            const results = await Promise.all(uploadPromises);

            if (!results) throw new apiError(500, "Failed to upload images")

            // creating postimgs which is an array of object, object has: public_id and secure_url as key
            const uploadedimgs = results.map((result) => {
                return {
                    public_id: result?.public_id,  //public id of image from cloudinary
                    secure_url: result?.secure_url // secure_url of image from cloudinary
                }
            })

            newpostimgs = [...newpostimgs, ...uploadedimgs];

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

    const updatedPost = await Post.findByIdAndUpdate(
        postId,
        {
            content,
            theme,
            postimgs: newpostimgs,
        }, {
        new: true,
    }
    )

    if (!updatedPost) throw new apiError(500, "Failed to update the post");

    res.status(200).json(new apiResponse(200, updatedPost, "Successfully updated the post"))
})

const toggleLike = asyncHandler(async (req, res) => {
    const postId = req?.params?.postId;
    const userId = req?.user?._id;

    if (!postId) throw new apiError(400, "PostId not provided");

    const post = await Post.findById(postId);

    if (!post) throw new apiError(404, "Post not found");

    // checking and removing user from disliked array
    const dislikedIndex = post?.dislikedby?.indexOf(userId);
    if (dislikedIndex > -1) {
        post?.dislikedby.splice(dislikedIndex, 1);
    }

    // checking and toggling user from liked array
    const likedIndex = post?.likedby?.indexOf(userId);

    if (likedIndex > -1) {
        // removing user from like array, if he has already liked post
        post?.likedby.splice(likedIndex, 1);
    } else {
        post?.likedby.push(userId); //adding user in liked array if he hasn't liked the post yet
    }

    // update the post 
    const updatedPost = await post.save({
        validateBeforeSave: false,
        timestamps: false, //donot modify updatedAt field for this operation
    });

    // Populate after the post has been saved
    const populatedPost = await Post.findById(updatedPost._id)
    .populate('user', '_id username profilepic')
    .populate('likedby', '_id username profilepic')
    .populate('dislikedby', '_id username profilepic');

    return res.status(200).json(new apiResponse(200, populatedPost, "Successfully liked the post"))

})

const toggleDislike = asyncHandler(async (req, res) => {
    const postId = req?.params?.postId;
    const userId = req?.user?._id;

    if (!postId) throw new apiError(400, "PostId not provided");

    const post = await Post.findById(postId);

    if (!post) throw new apiError(404, "Post not found");

    // checking and removing user from liked array
    const likedIndex = post?.likedby?.indexOf(userId);
    if (likedIndex > -1) {
        post?.likedby.splice(likedIndex, 1);
    }

    // checking and toggling user from disliked array
    const dislikedIndex = post?.dislikedby?.indexOf(userId);
    if (dislikedIndex > -1) {
        // removing user from dislike array, if he has already disliked post
        post?.dislikedby.splice(dislikedIndex, 1);
    } else {
        post?.dislikedby.push(userId); //adding user in disliked array if he hasn't disliked the post yet
    }

    // update the post 
    const updatedPost = await post.save({
        validateBeforeSave: false,
        timestamps: false, //donot modify updatedAt field for this operation
    });

    
    // Populate after the post has been saved
    const populatedPost = await Post.findById(updatedPost._id)
    .populate('user', '_id username profilepic')
    .populate('likedby', '_id username profilepic')
    .populate('dislikedby', '_id username profilepic');
        

    return res.status(200).json(new apiResponse(200, populatedPost, "Successfully liked the post"))

})

export {
    createPost,
    getAllPosts,
    getUserPosts,
    deletePost,
    getSinglePost,
    updatePost,
    toggleLike,
    toggleDislike,
}
