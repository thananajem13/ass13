 
import { createAndSave, find, findOne } from "../../DB/DBMethods.js"
import userModel from "../../DB/model/User.model.js"
import { roles } from "../middleware/auth.js"
import bcrypt from 'bcryptjs' 

export const addFirstAdmin = async () => {
    try {
        const email = 'thana.najem3@gmail.com'
        const password = "123456qwert$EE"
        const role = roles.Admin
        const userName = "thana najem" 
        const user = await findOne({model:userModel,filter:{email},select:'email'})
          
         
        if (!user) {
            const hasPassword = bcrypt.hashSync(password,parseInt(process.env.SALTROUND))
             
            // I cancel confirmation because manual creation
             
            const savedAdmin = await createAndSave({model:userModel,data:{email, password: hasPassword, role, userName, confirmEmail: true}})
            
            
            if (savedAdmin) {
                console.log(`admin saved: ${savedUser}`);
            } else {
                console.log(`fail to save admin`);
            }
        }
        else {
            console.log('admin exist so no need to add him');
        }
    } catch (error) {
        console.log(`catch error: ${error}`);
        // return next(Error('catch error admin creation', { cause: 500 }))
    }

}
export const getNoOfAdmins = async(req,res)=>{
    const admins = await find({model:userModel,filter:{role:roles.Admin,deleted:false,blocked:false,confirmEmail:true,_id:{$ne:req.user?._id}}})
    return admins.length;

}