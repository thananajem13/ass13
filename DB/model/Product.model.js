import { Schema, model, Types } from "mongoose";


const productSchema = new Schema({

    name: {
        type: String,
        required: [true, 'name is required'],
        unique: [true, 'product name must be unique'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char'],
        trim: true

    },
    slug: String,
    description: String,
    images: [String],
    imagePublicIds: [String],
    stock: {
        type: Number,
        default: 0
    },
    soldItems: {
        type: Number,
        default: 0
    },
    amount: {
        type: Number,
        default: 0
    },
    price: {
        type: Number,
        default: 0
    },
    discount: {
        type: Number,
        default: 0
    },
    finalPrice: {
        type: Number,
        default: 0
    },
    colors: {
        type: [String],
    },
    avgRate:{
        type:Number,
        default:0
    },
    size: {
        type: [String],
        enum: ['s', 'm', 'l', 'xl']
    },
    createdBy: {
        type: Types.ObjectId,
        ref: "User",
        required: [true, 'product owner is required']
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: "User", 
    },
    categoryId: {
        type: Types.ObjectId,
        ref: "Category",
        required: [true, 'product category is required']
    },

    subcategoryId: {
        type: Types.ObjectId,
        ref: "subCategory",
        required: [true, 'product sub category is required']
    },
    brandId: {
        type: Types.ObjectId,
        ref: "Brand",
        required: [true, 'product brand is required']
    },
}, {

    timestamps: true,
    toJSON: { virtuals: true },
    toObject: { virtual: true }
})



const productModel = model('product', productSchema)
export default productModel