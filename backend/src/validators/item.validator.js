import { body } from "express-validator";
import { validateErrorHandler } from "./auth.validator.js";

export const saveItemValidation = [

 
  body("url")
    .trim()
    .notEmpty().withMessage("URL is required")
    .isURL({
      protocols: ["http", "https"],
      require_protocol: true,
    })
    .withMessage("Invalid URL format"),


  body("sourceType")
    .trim()
    .notEmpty().withMessage("sourceType is required")
    .isIn([
      "article",
      "tweet",
      "youtube",
      "pdf",
      "image",
      "note",
      "instagram",
      "linkedin",
      "other"
    ])
    .withMessage("Invalid sourceType value"),


  body("userNote")
    .optional()
    .trim()
    .isLength({ min: 5, max: 200 })
    .withMessage("userNote must be between 5 and 200 characters"),


  validateErrorHandler,
];