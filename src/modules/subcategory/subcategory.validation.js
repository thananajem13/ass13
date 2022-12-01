import joi from 'joi'
export const createSubCategory={
    params:joi.object().required().keys({
        categoryId:joi.string().required().min(24).max(24).messages({

        })
    }),
    body: joi.object().required().keys({
        name:joi.string().required().messages({

        }),  
    }), 
    headers:joi.object().required().keys({
        authorization:joi.string().required().messages({
            "string.empty":"fill authorization filed, shouldn't be empty",
            "string.base":"authorization must be a string",
            "any.required":"authorization is required"
        })}).options({ allowUnknown: true })

}

export const updateSubCategory = {
    params:joi.object().required().keys({
        id:joi.string().required().trim().min(24).max(24).messages({

        }),
        categoryId:joi.string().required().trim().min(24).max(24).messages({

        }),
    }),
    body: joi.object().keys({
        name:joi.string().allow('').messages({

        })
    }), 
    headers:joi.object().required().keys({
        authorization:joi.string().required().messages({
            "string.empty":"fill authorization filed, shouldn't be empty",
            "string.base":"authorization must be a string",
            "any.required":"authorization is required"
        })}).options({ allowUnknown: true })


}
export const getSubCategory = {
    params:joi.object().required().keys({
        id:joi.string().required().trim().min(24).max(24).messages({

        }),
        
    }),  


}
