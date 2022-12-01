import { roles } from "../../middleware/auth.js";

export const endPoint = {
    profile:[roles.Admin,roles.User],
    updatePassword:[roles.Admin,roles.User],
    softDelete:[roles.Admin,roles.User],
    getUser:[roles.Admin,roles.User],
    blockUser:[roles.Admin],

}