import { Router } from "express";
import identifyingUser from "../middleware/auth.middleware.js";
import { saveItemController ,
   fetchItemController ,
    resurfacedController ,
     getSingleItemController ,
     updateItemController,
     deleteItemController,
     addHighlightController
     } 
from "../controllers/item.controller.js";
import {saveItemValidation} from "../validators/item.validator.js"





const itemRouter = Router();






/**
 * @method    POST
 * @route     /api/items
 * @description     save or create  a new item
 * @body       {url,sourceType,userNote(optional)}
 */
itemRouter.post("/" , saveItemValidation , identifyingUser ,  saveItemController )





/**
 * @method    GET
 * @route    /api/items
 * @description    fetch all the saved items of the user
 */
itemRouter.get("/", identifyingUser , fetchItemController )






/**
 * @method    GET
 * @route    /api/items/ resurfaced
 * @description    fetch all the resurfaced items (before 30days)
 */

itemRouter.get("/resurfaced" , identifyingUser ,resurfacedController)







/**
 * @method      GET
 * @route    /api/items/:id
 * @description    fetch single item
 */
itemRouter.get("/:id" , identifyingUser , getSingleItemController)
 





/**
 * @method      PATCH
 * @route       /api/items/:id
 * @description    update single item
 */

itemRouter.patch("/:id" , identifyingUser , updateItemController)




/**
 * @method      DELETE
 * @route        /api/items/:id
 * @description    delete single item
 */
itemRouter.delete("/:id" , identifyingUser , deleteItemController)
 




/**
 * @method     POST
 * @route      /api/items/:id/highlights
 * @descrition     add highlight
 */

itemRouter.post("/:id/highlights" , identifyingUser , addHighlightController)











export default itemRouter