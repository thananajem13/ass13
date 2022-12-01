import { Router } from "express"; 
import { endPoint } from "./subcategory.endPoint.js";
import { myMulter,fileValidation } from "../../services/multer.js";
import * as validators from './subcategory.validation.js'
import * as subCategory from './controller/subCategory.js'
import { auth } from "../../middleware/auth.js";
import { validation } from "../../middleware/validation.js";
const router = Router({mergeParams:true})


// router.get('/',(req,res)=>{
//     console.log({pp:req.params});
//     console.log({pp:req.originalUrl});
//     res.json({mes:"done"})
// })

router.post('/',auth(endPoint.add),
myMulter(fileValidation.image).single('image'),
validation(validators.createSubCategory),
subCategory.createSubCategory )

router.put('/:id',auth(endPoint.update),validation(validators.updateSubCategory),myMulter(fileValidation.image).single('image'),subCategory.updateSubCategory )

router.get('/',subCategory.getAllSubCategories)
router.get('/:id',validation(validators.getSubCategory), subCategory.getSubCategory )
// router.get('/',validation(validators.getSubCategories) ,subCategory.getAllSubCategories )




export default router