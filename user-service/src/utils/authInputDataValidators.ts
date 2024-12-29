import { body } from "express-validator";

const signupValidator = [
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Invalid email address."),
  body("password")
    .trim()
    .notEmpty()
    .isLength({ min: 8 })
    .withMessage("Password must be at least 8 characters long."),
  body("username")
    .trim()
    .notEmpty()
    .isAlphanumeric()
    .withMessage("Username must be alphanumeric."),
  body("firstname")
    .optional() // Validation applies only if this field has a value
    .trim()
    .isAlpha()
    .withMessage("Firstname must contain only alphabetical characters."),
  body("lastname")
    .optional() // Validation applies only if this field has a value
    .trim()
    .isAlpha()
    .withMessage("Lastname must contain only alphabetical characters."),
  body("phonenumber")
    .optional()
    .trim()
    .isNumeric()
    .isLength({ min: 9, max: 9 })
    .withMessage("Phone number must be of length 9."),
  body("numcountrycode")
    .optional()
    .trim()
    .isAlphanumeric()
    .withMessage("Country phone number code must be alphanumeric."),
];

const emailValidator = [
  body("email")
    .trim()
    .notEmpty()
    .isEmail()
    .withMessage("Invalid email address."),
];

export { signupValidator, emailValidator };
