import joi from 'joi'
export const addReview={
    params:joi.object().required().keys({
        productId:joi.string().required().min(24).max(24).messages({

        })
    }),
    body: joi.object().required().keys({
        text:joi.string().required().messages({

        }),  
        rating:joi.number().min(1).max(5).required().messages({

        }),  
    }), 
    headers:joi.object().required().keys({
        authorization:joi.string().required().messages({
            "string.empty":"fill authorization filed, shouldn't be empty",
            "string.base":"authorization must be a string",
            "any.required":"authorization is required"
        })}).options({ allowUnknown: true })

}
export const updateReview={
    params:joi.object().required().keys({
        reviewID:joi.string().required().min(24).max(24).messages({

        })
    }),
    body: joi.object().required().keys({
        text:joi.string().messages({

        }),  
        rating:joi.number().min(1).max(5).messages({

        }),  
    }), 
    headers:joi.object().required().keys({
        authorization:joi.string().required().messages({
            "string.empty":"fill authorization filed, shouldn't be empty",
            "string.base":"authorization must be a string",
            "any.required":"authorization is required"
        })}).options({ allowUnknown: true })

}
export const getReviewOfProduct={
    params:joi.object().required().keys({
        productId:joi.string().required().min(24).max(24).messages({

        })
    }), 
    query: joi.object().required().keys({
        page: joi.number().positive().min(1),
        size: joi.number().positive().min(1)
    })

}
export const deleteRate={
    params:joi.object().required().keys({
        rateID:joi.string().required().min(24).max(24).messages({

        })
    }), 

}
export const getReviewOfUserOnProduct={
    params:joi.object().required().keys({
        userId:joi.string().required().min(24).max(24).messages({

        }),
        productId:joi.string().required().min(24).max(24).messages({

        }),
    }),
    query: joi.object().required().keys({
        page: joi.number().positive().min(1),
        size: joi.number().positive().min(1)
    }) 

}
   