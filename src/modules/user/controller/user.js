import { findOne, findOneAndUpdate } from "../../../../DB/DBMethods.js";
import { asyncHandler } from "../../../services/errorHandling.js";
import bcrypt from 'bcryptjs'
import userModel from "../../../../DB/model/User.model.js";
import { getNoOfAdmins } from "../../../services/admin.js";
import { roles } from "../../../middleware/auth.js";
export const updatePassword = asyncHandler(
    async (req, res, next) => {
        const { _id, password } = req.user

        const { oldPassword, newPassword } = req.body
        const match = bcrypt.compareSync(oldPassword, password)
        if (match) {
            if(oldPassword!=newPassword){
                 const hashPass = bcrypt.hashSync(newPassword, parseInt(process.env.SALTROUND))
            const user = await findOneAndUpdate({ model: userModel, filter: { _id,deleted:false }, data: { password: hashPass }, options: { new: true } })
            if(!user){
                return res.status(400).json({message:"fail to update password try again or your account deleted"})
            }else{
                return res.status(400).json({message:"password updated successfully",user})
            }
            }else{
                return res.status(400).json({message:"old password equals to new password no changed occurs, please change your new password if you need"})
            }
           
        } else {
            return res.status(400).json({ message: "incorrect old password" })
        }

    }
)
export const softDelete = asyncHandler(
    async (req, res, next) => {
        const { _id,role } = req.user

        const countOfAdmins =await getNoOfAdmins(req,res)
        console.log({countOfAdmins});
        if(!countOfAdmins && role== roles.Admin){
            return next(Error('id you delete yourself no admin will be exist in website'))
        }
        const user = await findOneAndUpdate({model:userModel,filter:{_id},data:{deleted:true},options:{new:true}})
         
           if(!user){
            return next('fail to make soft delete',{cause:400})
           }else{
            return res.status(200).json({message:"soft delete done",user})
            
        //    return res.status(302).redirect(`${process.env.BASEURL}/auth/signin`)
           }
    

    }
)
export const blockUser = asyncHandler(
    async (req, res, next) => {
        const { _id } = req.user
        const { id } = req.params
        const userRole = await findOne({model:userModel,filter:{_id:id},select:'role'})
        if(userRole==roles.Admin){
           return next(Error('can\'t block another admin',{cause:403}))
        }else if(id==_id){
          return  next(Error('can\'t block yourself'),{cause:403})

        }
        //I don't check delete and confirm email because admin can block anytime
        const user = await findOneAndUpdate({model:userModel,filter:{_id:id,blocked:false},data:{blocked:true},options:{new:true}})
   return user?res.status(200).json({message:"Done",user}):next(Error('invalid id or blocked previously'))
    

    }
)
export const getUser = asyncHandler(
   async (req,res,next)=>{
    const {id} = req.params
    const user = await findOne({model:userModel,filter:{_id:id,deleted:false,confirmEmail:true,blocked:false}})
    user?res.status(200).json({message:"Done",user}):next(Error('invalid id or deleted or blocked or un confirmed account'))
    }
)
 