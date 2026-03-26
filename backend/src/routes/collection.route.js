import {Router} from "express";
import identifyingUser from "../middleware/auth.middleware.js";
import { createFolderController ,
   showAllFolderController ,
   getAllItemsController ,
   updateCollectionController ,
   deleteCollectionController,
   pushItemsinCollectionController,
   pullItemCollectionController
   } from "../controllers/collection.controller.js"




const collectionRouter = Router();


/**
 * collection ka matlab user apne saved items ko folder mein organize kar sakein
 */



/**
 * @method  POST
 * @route   /api/collections
 * @description   createa a new folder 
 */

collectionRouter.post("/" , identifyingUser ,  createFolderController )




/**
 * @method  GET
 * @route    /api/collections
 * @description  show all the folders of the user
 */
collectionRouter.get("/",  identifyingUser , showAllFolderController)





/**
 * @method   GET
 * @route     /api/collections/id
 * @description  show all the items of a collection
 */

collectionRouter.get("/:id", identifyingUser , getAllItemsController)



/**
 * @method   PATCH
 * @route     /api/collections/id
 * @description    update the collection/folder - name,description, color
 */
collectionRouter.patch("/:id", identifyingUser , updateCollectionController)




/**
 * @method    DELETE
 * @route     /api/collections/id
 * @description   delete the collection/folder
 */
collectionRouter.delete("/:id", identifyingUser , deleteCollectionController )




/**
 * @method      POST
 * @route     /api/collections/id/items
 * @description     item ko collection mein daalo
 */
collectionRouter.post("/:id/items", identifyingUser , pushItemsinCollectionController)







/**
 * @method   DELETE
 * @route     /api/collections/id/items/itemId
 * @description     item ko remove kardo folder se
 */

collectionRouter.delete("/:id/items/:itemId", identifyingUser ,pullItemCollectionController )



















export default collectionRouter