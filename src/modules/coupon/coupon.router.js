import { Router } from "express";
import {auth} from '../../middleware/auth.js'
import { endPoint } from "./coupon.endPoint.js";
import * as validators from './coupon.validation.js'
import * as couponController from './controller/coupon.js'
import {validation} from '../../middleware/validation.js'
const router = Router()




router.get('/', (req ,res)=>{
    res.status(200).json({message:"Coupon Module"})
})
router.post('/',auth(endPoint.add),validation(validators.addCoupon),couponController.addCoupon)
router.put('/apply',auth(endPoint.ApplyCoupon),validation(validators.ApplyCoupon),couponController.ApplyCoupon)
router.put('/:couponID',auth(endPoint.add),validation(validators.updateCoupon),couponController.updateCoupon)

router.delete('/:couponID',auth(endPoint.add),validation(validators.deleteCoupon),couponController.deleteCoupon)



export default router