import { Router } from "express";
import { registerController ,loginController} from "../controllers/auth.controller.js"





const authRouter = Router();





/**
 * @method   POST
 * @route     /api/auth/register
 * @description   Register new user
 */

authRouter.post("/register", registerController)





/**
 * @method    POST
 * @route     /api/auth/login
 * @description   Login user and get JWT token
 */

authRouter.post("/login", loginController)











export default authRouter