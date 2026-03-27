import { Router } from "express";
import { registerController ,loginController , getMeController , logoutController} from "../controllers/auth.controller.js"
import identifyingUser from "../middleware/auth.middleware.js";
import {registerValidation , loginValidation} from "../validators/auth.validator.js"





const authRouter = Router();







/**
 * @method   POST
 * @route     /api/auth/register
 * @description   Register new user
 */

authRouter.post("/register", registerValidation , registerController)










/**
 * @method    POST
 * @route     /api/auth/login
 * @description   Login user and get JWT token
 */

authRouter.post("/login", loginValidation , loginController)










/**
 * @method   GET
 * @route    /api/auth/me
 * @description   Get logged in user details
 */

authRouter.get("/me", identifyingUser , getMeController)











/**
 * @method  POST
 * @route   /api/auth/logout
 * @description
 * 
 */
authRouter.post("/logout", logoutController )


















export default authRouter