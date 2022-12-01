import { roles } from "../../middleware/auth.js";

export const endPoint={
    addReview:[roles.Admin,roles.User],
    deleteRate:[roles.Admin,roles.User],
}