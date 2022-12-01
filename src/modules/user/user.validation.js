import joi from 'joi'
export const updatePassword = {
    body: joi.object().required().keys({
         
        oldPassword: joi.string().required().pattern(new RegExp(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}\[\]:;<>,.?\/~_+-=|]).{8,32}/)).messages({
        }),
          newPassword: joi.string().required().pattern(new RegExp(/(?=.*[0-9])(?=.*[a-z])(?=.*[A-Z])(?=.*[*.!@$%^&(){}\[\]:;<>,.?\/~_+-=|]).{8,32}/)).messages({
        }),
        
    }),
    headers:joi.object().required().keys({
      authorization:joi.string().required().messages({
          "string.empty":"fill authorization filed, shouldn't be empty",
          "string.base":"authorization must be a string",
          "any.required":"authorization is required"
      })}).options({ allowUnknown: true })
}
export const softDelete = {
  headers:joi.object().required().keys({
    authorization:joi.string().required().messages({
        "string.empty":"fill authorization filed, shouldn't be empty",
        "string.base":"authorization must be a string",
        "any.required":"authorization is required"
    })}).options({ allowUnknown: true })
}
export const getUser = {
  params:joi.object().required().keys({
    id:joi.string().min(24).max(24).required().messages({
         
    })})
}
export const blockUser = {
  params:joi.object().required().keys({
    id:joi.string().min(24).max(24).required().messages({
         
    })})
}