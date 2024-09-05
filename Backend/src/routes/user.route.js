import {Router} from 'express'
const router = Router();

import { verifyJWT } from '../middlewares/auth.middleware.js';
import { registerUser,loginUser, logoutUser } from '../controllers/user.controller.js'
 
router.route('/register').post(registerUser)
router.route('/login').post(loginUser)
router.route('/logout').post(verifyJWT, logoutUser)

export default router;