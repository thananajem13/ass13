import { roles } from "../../middleware/auth.js";

export const endPoint = {
    add:[roles.Admin,roles.User],
    ApplyCoupon:[roles.Admin,roles.User],
}