import mongoose, { Schema, model, Types } from "mongoose";


const categorySchema = new Schema({

    name: {
        type: String,
        unique: [true, 'category name must be unique'],
        required: [true, 'name is required'],
        min: [2, 'minimum length 2 char'],
        max: [20, 'max length 2 char']

    },
    slug: String,
    image: String,
    imagePublicID: String,
    createdBy: {
        type: Types.ObjectId,
        ref: 'User',
        required: [true, 'category owner required']
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: 'User',
        default: null
    },
}, {
    timestamps: true,
    toJSON:{virtuals:true},
    toObject:{virtuals:true}
})


categorySchema.virtual('subCategory', {
    ref: "subCategory",
    localField: "_id",
    foreignField: "categoryId"
})


const categoryModel =  model('Category', categorySchema)
export default categoryModel