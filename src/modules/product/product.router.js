import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { fileValidation, myMulter } from "../../services/multer.js";
import endPoint from "./product.endPoint.js";
import * as product from './controller/product.js'
import * as validators from './product.validation.js'
import { validation } from "../../middleware/validation.js";

const router = Router({})

router.post('/', auth(endPoint.add), myMulter(fileValidation.image).array('images' , 5),validation(validators.createProduct), product.createProduct)

router.put('/:id', auth(endPoint.update), myMulter(fileValidation.image).array('images' , 5),validation(validators.updateProduct), product.updateProduct)


router.get('/',validation(validators.products), product.products)

router.get('/subCategory/:subCategory',validation(validators.productOfSubCategory),product.productsOfSpecificSubCategory)

router.get('/name/',validation(validators.getProductByName),product.getProductByName)// or ?name = ... 
router.get('/category/:categoryID',validation(validators.productsOfSpecificCategory),product.productsOfSpecificCategory)
export default router