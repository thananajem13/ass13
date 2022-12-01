import joi from 'joi'
export const createBrand = {
    body:joi.object().required().keys({
        name:joi.string().required().messages({
            
        })
      }),
      headers:joi.object().required().keys({
        authorization:joi.string().required().messages({
            "string.empty":"fill authorization filed, shouldn't be empty",
            "string.base":"authorization must be a string",
            "any.required":"authorization is required"
        })}).options({ allowUnknown: true })
}
export const updateBrand = {
    body:joi.object().required().keys({
        name:joi.string().allow('').messages({

        })
      }),
      params:joi.object().required().keys({
        id:joi.string().required().trim().min(24).max(24).messages({

        })
      })
}
export const Brands = {
    query:joi.object().required().keys({
        page:joi.number().positive().min(1),
        size:joi.number().positive().min(1),
    })
}