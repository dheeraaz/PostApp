import Router from 'express'

import { verifyJWT } from '../middlewares/auth.middleware.js';
import { multerUpload } from '../middlewares/multer.middleware.js';
import { multerUploadErrorHandler } from '../middlewares/multer_upload_error.middleware.js'
import { maximumImagecount } from '../constants/constants.js';
import {
    createPost,
    getAllPosts,
    getUserPosts,
    deletePost,
    getSinglePost,
    updatePost,

} from '../controllers/post.controller.js';

const router = Router();

router.route('/createpost').post(verifyJWT, multerUpload.array('postimgs', maximumImagecount), multerUploadErrorHandler, createPost);
router.route('/getallposts').get(verifyJWT, getAllPosts);
router.route('/getuserposts/:userId').get(verifyJWT, getUserPosts);
router.route('/deletepost/:postId').delete(verifyJWT, deletePost);
router.route('/getsinglepost/:postId').get(verifyJWT, getSinglePost);

router.route('/updatepost/:postId').patch(verifyJWT, multerUpload.array('newimgfiles', maximumImagecount), multerUploadErrorHandler, updatePost);


export default router