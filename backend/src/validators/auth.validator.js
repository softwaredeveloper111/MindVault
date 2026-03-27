

import { body, validationResult } from "express-validator";


export const validateErrorHandler = (req, res, next) => {
  const errors = validationResult(req);

  if (!errors.isEmpty()) {
    return res.status(400).json({
      success: false,
      message:"validation failed",
      errors: errors.array().map(err => err.msg),
    });
  }

  next()
}


export const registerValidation = [
  
  body("username")
    .trim()
    .notEmpty().withMessage("Username is required")
    .isLength({ min: 4, max: 20 }).withMessage("Username must be 4–20 characters long")
    .matches(/^[a-zA-Z_][a-zA-Z0-9_]*$/)
    .withMessage("Username must start with a letter or underscore and contain only letters, numbers, or underscores"),

  
  body("email")
    .trim()
    .notEmpty().withMessage("Email is required")
    .isEmail().withMessage("Invalid email format")
    .normalizeEmail(),



  body("password")
    .trim()
    .notEmpty().withMessage("Password is required")
    .isLength({ min: 8 }).withMessage("Password must be at least 8 characters long")
    .matches(/[A-Z]/).withMessage("Password must contain at least one uppercase letter")
    .matches(/[a-z]/).withMessage("Password must contain at least one lowercase letter")
    .matches(/[0-9]/).withMessage("Password must contain at least one number")
    .matches(/[\W_]/).withMessage("Password must contain at least one special character"),



validateErrorHandler,


]



export const loginValidation = [
  body("identifier")
  .trim()
  .notEmpty().withMessage("Username is required"),

  body('password')
  .trim()
  .notEmpty().withMessage('password must be required for login'),

  validateErrorHandler

]