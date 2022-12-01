import { create, find, findById, findByIdAndDelete, findByIdAndUpdate, findOne, findOneAndUpdate } from "../../../../DB/DBMethods.js";
import cloudinary from "../../../services/cloudinary.js";
import { asyncHandler } from "../../../services/errorHandling.js";
import slugify from 'slugify'
import { paginate } from "../../../services/pagination.js";
import brandModel from "../../../../DB/model/Brand.model.js";
import productModel from "../../../../DB/model/Product.model.js";
import subCategoryModel from "../../../../DB/model/Subcategory.model.js";
import categoryModel from "../../../../DB/model/Category.model.js";


const populate = [
    {
        path: "createdBy",
        select: "userName email image"
    },
    {
        path: "updatedBy",
        select: "userName email image"
    },
    {
        path: "categoryId",
        populate: {
            path: "createdBy",
            select: "userName email image"
        }
    },
    {
        path: "subcategoryId",
        populate: {
            path: "createdBy",
            select: "userName email image"
        }
    },
    {
        path: "brandId",
        populate: {
            path: "createdBy",
            select: "userName email image"
        }
    }
]


export const createProduct = asyncHandler(
    async (req, res, next) => {
        if (!req.files?.length) {
            next(new Error('Images is required', { cause: 400 }))
        } else {

            const { name, amount, discount, price, subcategoryId, categoryId, brandId } = req.body;
            if (name) {
                req.body.slug = slugify(name)
            }

            req.body.stock = amount

            req.body.finalPrice = price - (price * ((discount || 0) / 100))

            const category = await findOne({
                model: subCategoryModel,
                filter: { _id: subcategoryId, categoryId }
            })
            console.log({ category });
            if (!category) {
                return next(new Error('In-valid category or sub category ids', { cause: 404 }))
            }

            const brand = await findOne({
                model: brandModel,
                filter: { _id: brandId }
            })
            console.log({ brand });
            if (!brand) {
                return next(new Error('In-valid brand id', { cause: 404 }))
            }
            const images = []
            const imagePublicIds = []
            for (const file of req.files) {

                // I should add try and catch to prevent break upload if any image has a problem's uploading
                try {


                    //if we use name with # then it will fail to upload so slug will remove it
                    var { secure_url, public_id } =
                        await cloudinary.uploader.upload(file.path,
                            { folder: `OnlineCommerce/products/${req.body.slug}` }
                        )

                    images.push(secure_url)
                    console.log({ images });
                    imagePublicIds.push(public_id)

                } catch (e) {
                    console.log(e)
                }
            }

            req.body.images = images
            req.body.imagePublicIds = imagePublicIds
            req.body.createdBy = req.user._id

            const product = await create({
                model: productModel,
                data: req.body
            })
            console.log({ product });
            console.log({ images });

            if (product) {

                // console.log({test});
                return res.status(201).json({ message: "Done", product })

            } else {
                await cloudinary.api.delete_resources(imagePublicIds)

                next(Error('err occurs when create product', { cause: 400 }))
            }
        }

    }
)


export const updateProduct = asyncHandler(
    async (req, res, next) => {
        const { id } = req.params;

        const product = await findById({
            model: productModel,
            filter: id
        })

        if (!product) {
            next(new Error('In-valid product Id'))
        }
        if (categoryId && subcategoryId) {
            const category = await findOne({
                model: subCategoryModel,
                filter: { _id: subcategoryId, categoryId }
            })
            if (!category) {
                next(new Error('In-valid category or sub category ids', { cause: 404 }))
            }

        }

        if (brandId) {
            const brand = await findOne({
                model: brandModel,
                filter: { _id: brandId }
            })
            if (!brand) {
                next(new Error('In-valid brand id', { cause: 404 }))
            }
        }
        const { name, amount, price, discount, categoryId, subcategoryId, brandId } = req.body
        let { publicID } = req.body
        if (Array.isArray(publicID) && publicID?.length > 1) {
            publicID = publicID[0]
        }
        if (name) {
            req.body.slug = slugify(name)
        }

        //update existence image
        let images = []
        let imagePublicIds = []
        console.log({ publicID, file: req.files?.length });
        if (publicID && req.files?.length && product.imagePublicIds.includes(publicID)) {
            console.log({ ifcond: product.imagePublicIds.includes(publicID) });
            // if (product.imagePublicIds.includes(publicID)) {
            await cloudinary.uploader.destroy(publicID)

            for (const file of req.files) {

                // I should add try and catch to prevent break upload if any image has a problem's uploading
                try {


                    var { secure_url, public_id } =
                        await cloudinary.uploader.upload(file.path,
                            { folder: `OnlineCommerce/products/${product._id}` }
                        )

                    images.push(secure_url)
                    console.log({ images });
                    imagePublicIds.push(public_id)

                    console.log({ images, imagePublicIds });
                } catch (e) {
                    console.log(e)
                }
            }
            if (images.length) {
                //imagePublicIds , images
                await findByIdAndUpdate({ model: productModel, filter: { _id: product._id }, data: { $pull: { imagePublicIds: publicID } } })
                const update1 = await findByIdAndUpdate({ model: productModel, filter: { _id: product._id }, data: { $push: { imagePublicIds: { $each: imagePublicIds } } } })
                if (!update1) {
                    await cloudinary.api.delete_resources(imagePublicIds)

                }
                const index = product.images.findIndex(element => {
                    if (element.includes(publicID)) {
                        return true;
                    }
                });

                await findByIdAndUpdate({ model: productModel, filter: { _id: product._id }, data: { $pull: { images: product.images[index] } } })

                const update2 = await findByIdAndUpdate({ model: productModel, filter: { _id: product._id }, data: { $push: { images: { $each: images } } } })

            }
            // }
        }
        //no public id so add image to array of product image
        else if (req.files?.length) {
            for (const file of req.files) {

                // I should add try and catch to prevent break upload if any image has a problem's uploading
                try {


                    var { secure_url, public_id } =
                        await cloudinary.uploader.upload(file.path,
                            { folder: `OnlineCommerce/products/${product._id}` }
                        )

                    images.push(secure_url)
                    console.log({ images });
                    imagePublicIds.push(public_id)

                } catch (e) {
                    console.log(e)
                }
            }
            console.log({ images, imagePublicIds });

            const test = await findByIdAndUpdate({
                model: productModel, filter: { _id: product._id },
                data: {
                    $addToSet: { imagePublicIds: imagePublicIds }
                }
            })
            console.log({ test });
            await findByIdAndUpdate({
                model: productModel, filter: { _id: product._id }, data: {
                    $addToSet: { images: images }
                }
            })
            //   const test=  await findByIdAndUpdate({model:productModel,filter:{_id:product._id},data:{ $push: { imagePublicIds: {$each : imagePublicIds} } }})
            //   console.log({test});
            //     await findByIdAndUpdate({model:productModel,filter:{_id:product._id},data:{ $push: { images: {$each:images} } }})

        }
        if (amount && amount >= product.soldItems) {
            const calStock = amount - product.soldItems
            calStock > 0 ? req.body.stock = calStock : req.body.stock = 0
        }

        if (price & discount) {
            req.body.finalPrice = price - (price * (discount / 100))
        } else if (price) {
            req.body.finalPrice = price - (price * (product.discount / 100))
        } else if (discount) {
            req.body.finalPrice = product.price - (product.price * (discount / 100))
        }




        req.body.updatedBy = req.user._id

        // if (req.files?.length) {
        //     const images = []
        //     const imagePublicIds = []
        //     for (const file of req.files) {
        //         try {
        //             const { secure_url, public_id } = await cloudinary.uploader.upload(file.path, { folder: `OnlineCommerce/products/${req.body.slug}` })
        //             images.push(secure_url)
        //             imagePublicIds.push(public_id)
        //         } catch (error) {
        //             console.log(error);
        //         }


        //     }
        //     req.body.imagePublicIds = imagePublicIds
        //     req.body.images = images
        // }

        const updateProduct = await findOneAndUpdate({
            model: productModel,
            data: req.body,
            filter: { _id: product._id },
            options: { new: false }
        })

        if (updateProduct) {
            // for (const imageID of product.imagePublicIds) {
            //     await cloudinary.uploader.destroy(imageID)
            // }
            res.status(200).json({ message: "Done", updateProduct })
        } else {
            next(new Error(`fail to update  product with  ID : ${product._id}`, { cause: 400 }))
        }

    }
)


export const products = asyncHandler(
    async (req, res, next) => {

        const { limit, skip } = paginate({ page: req.query.page, size: req.query.size })
        const productList = await find({
            model: productModel,
            filter: {},
            populate: populate,
            skip,
            limit
        })

        productList.length ? res.status(200).json({ message: "Done", productList }) : res.status(200).json({ message: "no data found", productList })
    }
)
export const productsOfSpecificSubCategory = asyncHandler(
    async (req, res, next) => {
        const { subCategory } = req.params
        const checkSubCategory = await findOne({model:subCategoryModel,filter:{_id:subCategory}})
        if(!checkSubCategory){
            next(Error('invalid sub category id',{cause:404}))
        }
         console.log({subCategory});
        const { limit, skip } = paginate({ page: req.query.page, size: req.query.size })
        console.log({limit,skip});
        const productList = await find({
            model: productModel,
            filter: { subcategoryId: subCategory },
            populate: populate,
            skip,
            limit
        }) 
        productList.length ? res.status(200).json({ message: "Done", productList }) : res.status(200).json({ message: "no data found", productList })
    }
)
export const productsOfSpecificCategory = asyncHandler(
    async (req, res, next) => {
        const { categoryID } = req.params  
        const checkCategory = await findOne({model:categoryModel,filter:{_id:categoryID}})

if(!checkCategory){
            next(Error('invalid category id',{cause:404}))
        }
        const { limit, skip } = paginate({ page: req.query.page, size: req.query.size })
        console.log({limit,skip});
        const productList = await find({
            model: productModel,
            filter: { categoryId: categoryID },
            populate: populate,
            skip,
            limit
        }) 
        productList.length ? res.status(200).json({ message: "Done", productList }) : res.status(200).json({ message: "no data found", productList })
    }
)
export const getProductByName = asyncHandler(
    async (req, res, next) => { 
        const { name } = req.body 
        const { limit, skip } = paginate({ page: req.query.page, size: req.query.size })
        console.log({limit,skip,name:`/${name}/` });
        const productList = await find({
            model: productModel,
            filter: { 
                name: {  $regex: '.*' + name + '.*', //or you can use `.*${name}.*`
                $options: 'i'
            } 
        }, 
            populate: populate,
            skip,
            limit
        }) 
        productList.length ? res.status(200).json({ message: "Done", productList }) : res.status(200).json({ message: "no data found", productList })
    }
)

 
//delete