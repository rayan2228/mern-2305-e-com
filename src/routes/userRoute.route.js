import e from "express";
import { createUser, emailVerify, login, userUpdate } from "../controllers/userController.controller.js";
import { validation } from "../middlewares/validation.middleware.js";
import { upload } from "../middlewares/multer.middleware.js"
const router = e.Router()

router.route("/user").post(validation, createUser)
router.route("/user/:link").get(emailVerify)
router.route("/user/login").post(login)
router.route("/user/update").post(upload.single("profilePic"), userUpdate)

export default router