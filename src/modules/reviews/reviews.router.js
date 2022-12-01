import { Router } from "express";
import {validation } from '../../middleware/validation.js'
import * as validators from './reviews.validation.js'
import * as reviewController from './controller/reviews.js'
import { endPoint } from "./reviews.endPoint.js";
import { auth } from "../../middleware/auth.js";

const router = Router()




router.get('/:productId',  validation(validators.getReviewOfProduct),reviewController.getReviewOfProduct)
router.get('/user/:userId/product/:productId',  validation(validators.getReviewOfUserOnProduct),reviewController.getReviewOfUserOnProduct)

//this will add and update review if exist
router.post('/:productId',auth(endPoint.addReview),validation(validators.addReview),reviewController.addReview)
router.put('/:reviewID',auth(endPoint.addReview),validation(validators.updateReview),reviewController.updateReview)
router.delete('/:rateID',auth(endPoint.deleteRate),validation(validators.deleteRate),reviewController.deleteRate)


export default router