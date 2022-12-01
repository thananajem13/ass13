import { Schema, model, Types } from "mongoose"; 


const couponSchema = new Schema({

     
    addedBy: {
        type: Types.ObjectId,
        ref: "User", 
        required: [true, 'user is required']
    },
    usedBy: {
        type: Types.ObjectId,
        ref: "User", 
        default:null, 
    },
    amount: {
        type: Number, 
        required: [true, 'amount is required']
    }, 
    code:{
        type:String,
        required: [true, 'code is required'],
        default:null,
    }
}, {
    timestamps: true
})


const couponModel = model('Coupon', couponSchema)
export default couponModel