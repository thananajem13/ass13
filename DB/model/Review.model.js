import { Schema, model, Types } from "mongoose";
import { roles } from "../../src/middleware/auth.js";


const reviewSchema = new Schema({

    text: {
        type: String,
        required: [true, 'text is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char']

    }, 
    userId: {
        type: Types.ObjectId,
        ref: "User", 
        required: [true, 'user is required']
    },
    productId: {
        type: Types.ObjectId,
        ref: "product",
        required: [true, 'product is required']
    },
    rating:{
        type:Number,
        required:[true,'rating is required']
    }
}, {
    timestamps: true
})


const reviewModel = model('Review', reviewSchema)
export default reviewModel