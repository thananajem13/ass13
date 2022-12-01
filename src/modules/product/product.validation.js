import joi from 'joi'
export const updateProduct = {
    body: joi.object().required().keys({
        name: joi.string().min(2),
        amount: joi.number().positive(),
        price: joi.number().positive(),
        discount: joi.number().positive(),
        subcategoryId: joi.string().min(24).max(24),
        categoryId: joi.string().min(24).max(24),
        brandId: joi.string().min(24).max(24),
        publicID: joi.string()
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required().messages({
            "string.empty": "fill authorization filed, shouldn't be empty",
            "string.base": "authorization must be a string",
            "any.required": "authorization is required"
        })
    }).options({ allowUnknown: true }),
    params: joi.object().required().keys({
        id: joi.string().min(24).max(24)
    })
}
export const createProduct = {
    body: joi.object().required().keys({
        name: joi.string().required().min(2),
        amount: joi.number().positive().required(),
        price: joi.number().positive().required(),
        discount: joi.number().positive(),
        subcategoryId: joi.string().required().min(24).max(24),
        categoryId: joi.string().required().min(24).max(24),
        brandId: joi.string().required().min(24).max(24),
    }),
    headers: joi.object().required().keys({
        authorization: joi.string().required().messages({
            "string.empty": "fill authorization filed, shouldn't be empty",
            "string.base": "authorization must be a string",
            "any.required": "authorization is required"
        })
    }).options({ allowUnknown: true })
}
export const productOfSubCategory = {
    params: joi.object().required().keys({
        subCategory: joi.string().required().min(24).max(24),

    }),
    query: joi.object().required().keys({
        page: joi.number().positive().min(1),
        size: joi.number().positive().min(1)
    })

}
export const productsOfSpecificCategory = {
    params: joi.object().required().keys({
        categoryID: joi.string().required().min(24).max(24),

    }),
    query: joi.object().required().keys({
        page: joi.number().positive().min(1),
        size: joi.number().positive().min(1)
    })

}
export const products = {
    query: joi.object().required().keys({
        page: joi.number().positive().min(1),
        size: joi.number().positive().min(1)
    })
}
export const getProductByName = {
    body: joi.object().required().keys({
        name: joi.string().required().min(2), 
    }),
}
