import { Router } from "express";
import { loginUser, logoutUser, registerUser, refreshAccessToken} from "../controllers/user.controller.js";
import {upload} from "../middlewares/multer.middleware.js"
import verifyJWT from "../middlewares/auth.middleware.js";

const router = Router()

router.route("/register").post(
    upload.fields([//Upload comes fro multer for uploading photos on cloudnary.
        {
            name: "avatar",
            maxCount: 1,
        },
        {
            name: "coverImage",
            maxCount: 1,
        }
    ]),
    registerUser)

    router.route("/login").post(loginUser)

    // Secured Routes 
    router.route("/logout").post(verifyJWT, logoutUser) 

    router.route("/refresh-token").post(refreshAccessToken)

export default router