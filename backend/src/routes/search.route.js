import {Router} from "express";
import {searchController , getTagsController ,getClustersController } from "../controllers/serach.controller.js"
import identifyingUser from "../middleware/auth.middleware.js";




const searchRouter = Router();







/**
 * @method  GET
 * @route    /api/search?keyword=text
 * @description    search items
 */

searchRouter.get("/" , identifyingUser, searchController )





/**
 * @route   GET
 * @route    /api/search/tags
 * @description → User ke saare unique tags return karo , Sidebar mein tag filter ke liye use hoga
 */

searchRouter.get("/tags", identifyingUser, getTagsController)






/**
 * @route  GET
 * @route   /api/search/clusters
 * @description   count the number of items under topic cluster
 */
searchRouter.get("/clusters", identifyingUser , getClustersController)














export default searchRouter