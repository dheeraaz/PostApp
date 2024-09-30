import Router from 'express'

import { verifyJWT } from '../middlewares/auth.middleware.js';
import { multerUpload } from '../middlewares/multer.middleware.js';
import { multerUploadErrorHandler } from '../middlewares/multer_upload_error.middleware.js'
import { maximumImagecount } from '../constants/constants.js';
import {
    createPost,
    getAllPosts,

} from '../controllers/post.controller.js';

const router = Router();

router.route('/createpost').post(verifyJWT, multerUpload.array('postimgs', maximumImagecount), multerUploadErrorHandler, createPost);
router.route('/getallposts').get(verifyJWT, getAllPosts);

export default router