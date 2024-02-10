import express from 'express'
import { deleteUser, getUserListing, test, updateUser } from '../controller/user.controller.js';
import { verifyToken } from '../utils/verifyUser.js';


const router=express.Router();

router.get('/test',test)
router.patch('/update/:id',verifyToken,updateUser)
router.delete('/delete/:id',verifyToken,deleteUser)
router.get('/listing/:id',verifyToken,getUserListing)

export default router;