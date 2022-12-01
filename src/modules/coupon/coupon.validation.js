import joi from 'joi'
export const addCoupon = {
    body: joi.object().required().keys({
        amount: joi.number().required().positive() ,
    }) ,
    headers: joi.object().required().keys({
        authorization: joi.string().required().messages({
            "string.empty": "fill authorization filed, shouldn't be empty",
            "string.base": "authorization must be a string",
            "any.required": "authorization is required"
        })
    }).options({ allowUnknown: true })
}
export const deleteCoupon = {
    params: joi.object().required().keys({
        couponID: joi.string().required().min(24).max(24) ,
    }) ,
    headers: joi.object().required().keys({
        authorization: joi.string().required().messages({
            "string.empty": "fill authorization filed, shouldn't be empty",
            "string.base": "authorization must be a string",
            "any.required": "authorization is required"
        })
    }).options({ allowUnknown: true })
}
export const updateCoupon = {
    params: joi.object().required().keys({
        couponID: joi.string().required().min(24).max(24) ,
    }) ,
    headers: joi.object().required().keys({
        authorization: joi.string().required().messages({
            "string.empty": "fill authorization filed, shouldn't be empty",
            "string.base": "authorization must be a string",
            "any.required": "authorization is required"
        })
    }).options({ allowUnknown: true }),
    body: joi.object().required().keys({
        amount: joi.number().required().positive() ,
    }) ,
}
export const ApplyCoupon = {
    
    headers: joi.object().required().keys({
        authorization: joi.string().required().messages({
            "string.empty": "fill authorization filed, shouldn't be empty",
            "string.base": "authorization must be a string",
            "any.required": "authorization is required"
        })
    }).options({ allowUnknown: true }),
    body: joi.object().required().keys({
        code: joi.string().required() ,
    }) ,
}
