import { asyncHandler } from '../../../services/errorHandling.js'
import { create, find, findById, findByIdAndUpdate, findOne } from '../../../../DB/DBMethods.js'
import categoryModel from '../../../../DB/model/Category.model.js'
import cloudinary from '../../../services/cloudinary.js'
import slugify from 'slugify'
import { getPagesNoOfPagination, paginate } from '../../../services/pagination.js'
import subCategoryModel from '../../../../DB/model/subCategory.model.js'
const populate=
[
    {
        path: 'createdBy',
        select: 'userName email image'

    },
    {
        path: 'updatedBy',
        select: 'userName email image'

    },
    {
        path: 'subCategory'
    }
]
export const createCategory = asyncHandler(
    async (req, res, next) => {
        console.log({ body: req.body });
        console.log({ file: req.file });
        if (!req.file) {
            next(new Error('image is required', { cause: 400 }))
        } else {
            const { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: "onlineECommerce/categories" })
            console.log({ imagePublicId: public_id });

            const name = req.body?.name
            console.log({ name });
            const category = await create(
                {
                    model: categoryModel,
                    data: {
                        name,
                        slug: name ? slugify(name) : "",
                        createdBy: req.user._id,
                        imagePublicID: public_id,
                        image: secure_url,
                    }
                })
            if (category) {
                res.status(201).json({ message: "Done", category })
            } else {
                await cloudinary.uploader.destroy(public_id)
                next(Error('fail to save category', { cause: 400 }))
            }



        }
    }
)
export const getAllCategories = asyncHandler(
    async (req, res, next) => {
        const { skip, limit } = paginate({ page: req.query.page, size: req.query.size })

        const categories = await find({
            model: categoryModel,
            populate ,
            skip,
            limit
        })
        const noOfPages = getPagesNoOfPagination({ data: categories, size: limit }) || 0
        categories.length ? res.status(200).json({
            message: "Done", categories
            , noOfPages
        }) :
            next(Error('no category found', { cause: 400 }))
        // const category = []
        // const cursor = categoryModel.find({  }).populate(
        //     [
        //         {
        //             path: 'createdBy',
        //             select: 'userName email image'

        //         },
        //         {
        //             path: 'updatedBy',
        //             select: 'userName email image'

        //         },
        //     ]
        // ).skip(skip).limit(limit).cursor();

        // for (let doc = await cursor.next(); doc != null; doc = await cursor.next()) {
        //     const subCategories = await find(

        //         {filter:{categoryId:doc._id},
        //             model:subCategoryModel, 
        //             populate:
        //              [
        //                 {
        //                     path: 'createdBy',
        //                     select: 'userName email image'

        //                 },
        //                 {
        //                     path: 'updatedBy',
        //                     select: 'userName email image'

        //                 }
        //             ]})
        //     console.log(doc); // Prints documents one at a time
        //     const conObj = doc.toObject()
        //     conObj.subCategories =subCategories ;
        //     category.push(conObj)
        // }
        // const categories = await find({ model: categoryModel })



    }
)
export const getCategory = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params

        const category = await findById({
            model: categoryModel,
            filter: { _id: id },
            populate ,



        })

        category ? res.status(200).json({ message: "Done", category }) :
            res.status(200).json({ message: "no category found (invalid id)", category })

    }
)
export const updateCategory = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params
        if (req.file) {
            var { secure_url, public_id } = await cloudinary.uploader.upload(req.file.path, { folder: "onlineECommerce/categories" })
            req.body.image = secure_url
            req.body.imagePublicID = public_id

        }


        const name = req.body?.name
        if (name) {
            req.body.slug = slugify(name)
        }
        req.body.updatedBy = req.user._id
        const category = await findByIdAndUpdate(
            {
                model: categoryModel,
                data: req.body,
                filter: { _id: id },
                options: { new: false }
            })
        if (category) {
            if (req.file) {
                await cloudinary.uploader.destroy(category.imagePublicID)

            }
            res.status(200).json({ message: "Done", category })
        } else {
            if (req.file) {
                await cloudinary.uploader.destroy(public_id)
            }
            next(Error('fail to save category or invalid category id', { cause: 400 }))
        }




    }
)
