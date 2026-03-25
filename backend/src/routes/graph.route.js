import {Router} from "express"
import identifyingUser from "../middleware/auth.middleware.js"
import {getGraphDataController , getRelatedItemsController} from "../controllers/graph.controller.js"





const graphRouter = Router();




/**
 * @method GET
 * @route   /api/graph
 * @description get graph
 */

graphRouter.get("/" ,  identifyingUser , getGraphDataController)



/**
 * @method   GET
 * @route    /api/graph/:itemId/related
 * @description    get related items
 */
graphRouter.get("/:itemId/related" , identifyingUser , getRelatedItemsController)









export default graphRouter