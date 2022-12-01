import { Router } from "express";
import * as registerController from './controller/registration.js'
import * as validators from './auth.validation.js'
import { validation } from "../../middleware/validation.js";
const router = Router()

//signup and confirmEmail
router.post('/signup',validation(validators.signup),registerController.signup)
router.get('/confirmEmail/:token',validation(validators.confirmEmail),registerController.confirmEmail)
// login
router.post('/signin',validation(validators.signin),registerController.signin)
router.get('/refreshToken/:token',validation(validators.refreshToken),registerController.refreshToken)
router.post('/forgetPassword',validation(validators.forgetPassword),registerController.forgetPassword)
router.post('/resetPassword',validation(validators.resetPassword),registerController.resetPassword)
export default router