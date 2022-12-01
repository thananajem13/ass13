import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { endPoint } from "./user.endPoint.js";
import * as validators from './user.validation.js'
import {validation} from '../../middleware/validation.js'
import * as userController from './controller/user.js'
const router = Router()




router.get('/',auth(endPoint.profile), (req ,res)=>{
    res.status(200).json({message:"Done",user:req.user })
})
router.patch('/updatePassword',auth(endPoint.updatePassword),validation(validators.updatePassword),userController.updatePassword)
router.patch('/softDelete',auth(endPoint.softDelete),validation(validators.softDelete),userController.softDelete)
router.patch('/blockUser/:id',auth(endPoint.blockUser),validation(validators.blockUser),userController.blockUser)
router.get('/getUser/:id',validation(validators.getUser),userController.getUser)




export default router