import { asyncHandler } from "../../../services/errorHandling.js";
import { nanoid } from 'nanoid'
import { createAndSave, findByIdAndDelete, findByIdAndUpdate, findOne, findOneAndUpdate, updateOne } from "../../../../DB/DBMethods.js";
import couponModel from '../../../../DB/model/Coupon.model.js'
export const addCoupon = asyncHandler(
    async (req, res, next) => {
        const code = nanoid()
        const { amount } = req.body
        const { _id } = req.user
        // addedBy
        const coupon = await createAndSave({ model: couponModel, data: { amount, code, addedBy: _id } })
        coupon ? res.status(200).json({ message: "Done", coupon }) : res.status(400).json({ message: "fail to save", coupon })
    }
)
export const updateCoupon = asyncHandler(
    async (req, res, next) => {
        const { couponID } = req.params

        const { amount } = req.body
        // addedBy
        const coupon = await findByIdAndUpdate({ model: couponModel, filter: { _id: couponID }, data: { amount }, options: { new: true } })
        coupon ? res.status(200).json({ message: "Done", coupon }) : res.status(400).json({ message: "fail to update or invalid coupon id", coupon })
    }
)
export const ApplyCoupon =
//  asyncHandler(
    async (req, res, next) => {
        const { code } = req.body
        const { _id } = req.user //usedBy 
        // addedBy
        
        console.log({test:code === null});
        if(code === null){
          return next(Error('  invalid coupon '),{cause:400})
        }
        const coupon = await findOneAndUpdate({ model: couponModel, filter: { code }, data: { usedBy: _id ,code:null},options:{new:true}  })
        console.log({coupon});
        coupon ? res.status(200).json({ message: "Done,", coupon }) : next(Error('you can\'t use coupon again -invalid- '),{cause:400})
    }
// )
export const deleteCoupon = asyncHandler(
    async (req, res, next) => {
        const { couponID } = req.params
        // addedBy
        const deletedCoupon = await findByIdAndDelete({ model: couponModel, filter: { _id: couponID } })
        deletedCoupon ? res.status(200).json({ message: "Done", deletedCoupon }) : res.status(400).json({ message: "fail to delete or invalid coupon id", deletedCoupon })
    }
)
