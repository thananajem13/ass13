import { asyncHandler } from "../../../services/errorHandling.js";
import productModel from '../../../../DB/model/Product.model.js'
import { createAndSave, deleteOne, find, findById, findByIdAndDelete, findByIdAndUpdate, findOne, findOneAndUpdate, findWithoutLimit } from "../../../../DB/DBMethods.js";
import reviewModel from "../../../../DB/model/Review.model.js";
import { Types } from "mongoose";
//this will add and update review if exist
export const addReview = asyncHandler(
        async (req, res, next) => {
            const { text, rating } = req.body;
            const userId = req.user._id;
            const { productId } = req.params
            console.log({ userId, productId });
            const product = await findOne({ model: productModel, filter: { _id: Types.ObjectId(productId) } })
            // console.log({product});
            if (!product) {
               return next(Error('invalid product id', { cause: 400 }))
            }
            //here is zero
                var reviewRate = await createAndSave({ model: reviewModel, data: { text, userId, productId: Types.ObjectId(productId), rating } })
                if (!reviewRate) {

                    next(Error('fail to add rate', { cause: 400 }))
                }
          
            const findRates = await findWithoutLimit({ model: reviewModel, filter: { productId: Types.ObjectId(productId) }, select: 'rating' })
            let totalRate = 0.0
            for (const rate of findRates) {
                console.log({ currRate: (rate.rating) });
                totalRate += rate.rating;
            }
            console.log({ total: totalRate });
            const countOfProductRates = findRates.length
            console.log({ countOfProductRates });
            const avgRating = totalRate / countOfProductRates
            const updateProd = await findByIdAndUpdate({ model: productModel, filter: { _id: Types.ObjectId(productId) }, data: { avgRate: avgRating }, options: { new: true } }) 
            return  updateProd &&  reviewRate ?   res.status(201).json({ message: "sucess", reviewRate,updateProd }) :  res.status(400).json({ message: "fail to add reviews", reviewRate,updateProd })


        }
)
export const updateReview = asyncHandler(
        async (req, res, next) => {
            const { text, rating } = req.body;
            const userId = req.user._id;
            const { reviewID } = req.params 
            const review = await findOne({ model: reviewModel, filter: { _id: reviewID } }) 
            if (!review) {
               return next(Error('invalid review id', { cause: 400 }))
            }
            const updateRate = await findOneAndUpdate({model:reviewModel,filter:{
                _id:reviewID,
                userId
            },
            data:{
                text,rating
            },options:{new:true},
        })
        if(!updateRate){
            return next(Error('filed to update or you\'re not owner', { cause: 400 }))

        }
             
          
            const findRates = await findWithoutLimit({ model: reviewModel, filter: { productId: Types.ObjectId(review.productId) }, select: 'rating' })
            let totalRate = 0.0
            for (const rate of findRates) {
                console.log({ currRate: (rate.rating) });
                totalRate += rate.rating;
            }
            console.log({ total: totalRate });
            const countOfProductRates = findRates.length
            console.log({ countOfProductRates });
            const avgRating = totalRate / countOfProductRates
            const updateProd = await findByIdAndUpdate({ model: productModel,options:{new:true}, filter: { _id: Types.ObjectId(review.productId) }, data: { avgRate: avgRating }, options: { new: true } }) 
            return  updateProd &&  updateRate ?   res.status(201).json({ message: "sucess", updateRate,updateProd }) :  res.status(400).json({ message: "fail to add reviews", updateRate,updateProd })


        }
)
// export const addReview =
//     asyncHandler(
//         async (req, res, next) => {
//             const { text, rating } = req.body;
//             const userId = req.user._id;
//             const { productId } = req.params
//             console.log({ userId, productId });
//             const product = await find({ model: productModel, filter: { _id: Types.ObjectId(productId) } })
//             // console.log({product});
//             if (!product) {
//                return next(Error('invalid product id', { cause: 404 }))
//             }
//             const checkIfUserRates = await find({
//                 model: reviewModel
//                 , filter:
//                 {
//                     userId,
//                     productId: Types.ObjectId(productId)
//                 }
//             })
//             // console.log({checkIfUserRates});
//             if (checkIfUserRates.length == 1) {
//                 var reviewUpdate = await findOneAndUpdate(
//                     {
//                         model: reviewModel,
//                         filter:
//                             { userId, productId: Types.ObjectId(productId) },
//                         data: { rating }
//                     })
//                 console.log({ reviewUpdate });
//                 if (!reviewUpdate) {
//                     next(Error('fail to update Rate', { cause: 400 }))
//                 }
//             }

//             else {
//                 //here is zero
//                 var reviewRate = await createAndSave({ model: reviewModel, data: { text, userId, productId: Types.ObjectId(productId), rating } })
//                 if (!reviewRate) {

//                     next(Error('fail to add rate', { cause: 400 }))
//                 }
//             }
//             const findRates = await find({ model: reviewModel, filter: { productId: Types.ObjectId(productId) }, select: 'rating' })
//             let totalRate = 0.0
//             for (const rate of findRates) {
//                 console.log({ currRate: (rate.rating) });
//                 totalRate += rate.rating;
//             }
//             console.log({ total: totalRate });
//             const countOfProductRates = findRates.length
//             console.log({ countOfProductRates });
//             const avgRating = totalRate / countOfProductRates
//             const updateProd = await findByIdAndUpdate({ model: productModel, filter: { _id: Types.ObjectId(productId) }, data: { avgRate: avgRating }, options: { new: true } })
//             const result = (reviewUpdate || reviewRate) === "udefined" ? reviewRate : reviewUpdate
//             if (updateProd && (reviewUpdate || reviewRate)) return res.status(201).json({ message: "sucess", reviewRate: result, updateProd })


//         }
//     )

export const getReviewOfProduct = asyncHandler(
    async (req, res, next) => {
        const { limit, skip } = paginate({ page: req.query.page, size: req.query.size })
       
        const { productId } = req.params
        const product = await findOne({ model: productModel, filter: { _id: productId } })
        if (!product) {
           return next(Error('invalid product id', { cause: 400 }))
        }
        const reviewOfProduct = await find({model:reviewModel,limit, skip,filter:{productId}})
        reviewOfProduct.length?res.status(200).json({message:"done",reviewOfProduct}):res.status(200).json({message:"no review exist",reviewOfProduct})
    }
)

export const deleteRate = asyncHandler(
    async (req, res, next) => {

        const { rateID } = req.params // if user allow to rate many but at add I suppose that user can add rating at once but I don't let him to add many text 
        
        const deleteRate = await findByIdAndDelete({ model: reviewModel, filter: { _id: rateID } })
        if (!deleteRate) {
           return next(Error('invalid rate id or failed to delete', { cause: 400 }))
        } 
        /** */
        const findRates = await find({ model: reviewModel, filter: { productId: Types.ObjectId(deleteRate.productId) }, select: 'rating' })
        let totalRate = 0.0
        for (const rate of findRates) {
            console.log({ currRate: (rate.rating) });
            totalRate += rate.rating;
        }
        console.log({ total: totalRate });
        const countOfProductRates = findRates.length
        console.log({ countOfProductRates });
        const avgRating = totalRate / countOfProductRates
        const updateProd = await findByIdAndUpdate({ model: productModel, filter: { _id: Types.ObjectId(deleteRate.productId) }, data: { avgRate: avgRating }, options: { new: true } })
        /** */
    return res.status(200).json({message:"done",deleteRate,updateProd}) 
    }
)
 
export const getReviewOfUserOnProduct = asyncHandler(
    async(req,res,next)=>{
        const {userId,productId} = req.params
        const reviews = await find({model:reviewModel,filter:{userId ,productId},populate:[{
            path:'userId'
        },{
            path:'productId'
        }]})
       
        reviews.length? res.status(200).json({message:"Done",reviews}): res.status(200).json({message:"no reviews exist for this user",reviews})
    }
)

