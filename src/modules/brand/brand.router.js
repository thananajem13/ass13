import { Router } from "express";
import { auth } from "../../middleware/auth.js";
import { fileValidation, myMulter } from "../../services/multer.js";
import endPoint from "./brand.endPoint.js";
import * as brand from './controller/brand.js'
import * as validators from './brand.validation.js'
import { validation } from "../../middleware/validation.js";

const router = Router({})

router.post('/', auth(endPoint.add), myMulter(fileValidation.image).single('image'),validation(validators.createBrand), brand.createBrand)

router.get('/',validation(validators.Brands), brand.Brands)

router.put('/:id', auth(endPoint.update), myMulter(fileValidation.image).single('image'),validation(validators.updateBrand), brand.updateBrand)

// router.get('/:id', brand.getbrandByID)





export default router