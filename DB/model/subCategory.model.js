import mongoose, { Schema, model, Types } from "mongoose";


const subCategorySchema = new Schema({

    name: {
        type: String,
        unique: [true, 'subCategory name must be unique'],
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
        required: [true, 'subCategory owner required']
    },
    updatedBy: {
        type: Types.ObjectId,
        ref: 'User',
        default: null
    },
    categoryId: {
        type: Types.ObjectId,
        ref: 'Category',
        default: null
    }
}, {
    timestamps: true,
  
})


 

const subCategoryModel = mongoose.models.subCategory || model('subCategory', subCategorySchema)
export default subCategoryModel