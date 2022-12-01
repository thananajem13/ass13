import jwt from 'jsonwebtoken'
import { findOne } from '../../DB/DBMethods.js';
import userModel from '../../DB/model/User.model.js';
import { asyncHandler } from '../services/errorHandling.js';
export const roles = { 
    Admin: "Admin",
    User:"User",
    HR:"HR"
 }
export const auth = (accessRoles = []) => {
    return asyncHandler(
        async (req, res, next) => {

            const { authorization } = req.headers
            // console.log({ authorization });
            if (!authorization?.startsWith(process.env.BearerKey)) {
                next(new Error('In-valid Bearer key', { cause: 400 }))
            } else {
                const token = authorization.split(process.env.BearerKey)[1]
                console.log({ tokenInAuthBeforeSplit: authorization.split(process.env.BearerKey) });
                const decoded = jwt.verify(token, process.env.tokenSignature)
                console.log({ decoded });
                if (!decoded?.id) {
                    next(new Error('In-valid token payload', { cause: 400 }))

                } else {
                    const user = await findOne({ model: userModel, filter: { _id: decoded.id,deleted:false, blocked: false, confirmEmail: true }, select: 'email userName role password' }) 
                    if (!user) {
                        next(new Error('Not register user or you\'re blocked or deleted user or un confirmEmail', { cause: 401 }))
                    } else {
                        console.log({accessRoles,role:user.role});
                        if (!accessRoles.includes(user.role)) {
                            next(new Error('not auth user', { cause: 403 }))//forbidden

                        } else {
                            req.user = user
                            next()
                        }

                    }
                }
            }



        }
    )

}