import { asyncHandler } from '../../../services/errorHandling.js'
import { create, find, findById, findByIdAndUpdate, findOne, findOneAndUpdate } from '../../../../DB/DBMethods.js'
import categoryModel from '../../../../DB/model/Category.model.js'
import cloudinary from '../../../services/cloudinary.js'
import slugify from 'slugify'
import { getPagesNoOfPagination, paginate } from '../../../services/pagination.js'
import subCategoryModel from '../../../../DB/model/subCategory.model.js'

export const createSubCategory = asyncHandler(
    async (req, res, next) => {
        if (!req.file) {
            next(new Error('image is required', { cause: 400 }))
        } else {
            const { categoryId } = req.params
            const category = await findOne({ model: categoryModel, filter: { _id: categoryId }, })
            if (!category) {
                next(Error('invalid parent category id', { cause: 404 }))
            } else {

                const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `onlineECommerce/categories/${categoryId}/subcategory` })
                console.log({ imagePublicId: public_id });

                const name = req.body?.name
                console.log({ name });
                const subCategory = await create(
                    {
                        model: subCategoryModel,
                        data: {
                            name,
                            slug: name ? slugify(name) : "",
                            createdBy: req.user._id,
                            imagePublicID: public_id,
                            image: secure_url,
                            categoryId
                        }
                    })
                if (subCategory) {
                    res.status(201).json({ message: "Done", subCategory })
                } else {
                    await cloudinary.uploader.destroy(public_id)
                    next(Error('fail to add new subCategory', { cause: 400 }))
                }

            }




        }
    }
)

export const updateSubCategory = asyncHandler(
    async (req, res, next) => {
        const { id, categoryId } = req.params

        if (req.file) {
            var { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: `onlineECommerce/categories/${categoryId}/subcategory/${id}` })
            req.body.image = secure_url
            req.body.imagePublicID = public_id

        }


        const name = req.body?.name
        if (name) {
            req.body.slug = slugify(name)
        }
        req.body.updatedBy = req.user._id
        const subCategory = await findOneAndUpdate(
            {
                model: subCategoryModel,
                data: req.body,
                filter: { _id: id, categoryId },
                options: { new: false }
            })
        if (subCategory) {
            if (req.file) {
                await cloudinary.uploader.destroy(subCategory.imagePublicID)

            }
            res.status(200).json({ message: "Done", subCategory })
        } else {
            if (req.file) {
                await cloudinary.uploader.destroy(public_id)
            }
            next(Error('fail to save category or invalid category id or invalid sub category id', { cause: 400 }))
        }




    }
)
export const getAllSubCategories = asyncHandler(
    async (req, res, next) => {
        const { categoryId } = req.params
        const { skip, limit } = paginate({ page: req.query.page, size: req.query.size })
        const subCategory = await find(
            {
                model: subCategoryModel
                , populate: [
                    {
                        path: 'createdBy',
                        select: 'userName email image'

                    },
                    {
                        path: 'updatedBy',
                        select: 'userName email image'

                    },
                    {
                        path: 'categoryId', 

                    },
                ],
                skip,
                limit


            }) 
        // const categories = await find({ model: categoryModel })
        // const noOfPages = getPagesNoOfPagination({ data: categories, size: limit }) || 0
        subCategory ? res.status(200).json({ message: "Done", subCategory,
        //  noOfPages
         }) :
            res.status(200).json({ message: "no subCategory found", subCategory, 
            // noOfPages 
        })

    }
)
export const getSubCategory = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params

        const subCategory = await findById({
            model: subCategoryModel,
            filter: { _id: id },
            populate: [
                {
                    path: 'createdBy',
                    select: 'userName email image'

                },
                {
                    path: 'updatedBy',
                    select: 'userName email image'

                },
                {
                    path: 'categoryId', 

                },
            ],



        })

        subCategory ? res.status(200).json({ message: "Done", subCategory }) :
            res.status(200).json({ message: "no subCategory found (invalid id)", subCategory })

    }
)
 