import { body, param } from "express-validator";

const productInfoValidation = [
  body("title")
    .exists({ checkFalsy: true })
    .trim()
    .notEmpty()
    .withMessage("Product title is required.")
    .isLength({ max: 100 })
    .withMessage("Product title must not exceed 100 characters."),

  body("image")
    .exists({ checkFalsy: true })
    .trim()
    .notEmpty()
    .withMessage("Product image URL is required.")
    .isURL()
    .withMessage("Product image must be a valid URL."),

  body("summary")
    .exists({ checkFalsy: true })
    .trim()
    .notEmpty()
    .withMessage("Product summary is required.")
    .isLength({ max: 255 })
    .withMessage("Product summary must not exceed 255 characters."),

  body("oldPrice")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Old price must be a positive number."),

  body("price")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Product price is required.")
    .isFloat({ min: 0 })
    .withMessage("Product price must be a positive number."),

  body("description")
    .exists({ checkFalsy: true })
    .trim()
    .notEmpty()
    .withMessage("Product description is required."),

  body("color")
    .optional()
    .isArray()
    .withMessage("Colors must be an array of strings.")
    .custom((colors) =>
      colors.every((color: string) => typeof color === "string")
    )
    .withMessage("Each color must be a string."),

  body("quantity")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("Quantity is required.")
    .isInt({ min: 0 })
    .withMessage("Quantity must be a non-negative integer."),

  body("special")
    .optional()
    .isBoolean()
    .withMessage("Special must be a boolean value."),

  body("brand").optional().isString().withMessage("Brand must be a string."),

  body("reviews")
    .optional()
    .isArray()
    .withMessage("Reviews must be an array.")
    .custom((reviews) =>
      reviews.every((review: any) =>
        ["username", "rating", "comment", "createdAt", "uid"].every((key) =>
          key in review
            ? typeof review[key] === "string" ||
              typeof review[key] === "number" ||
              review[key] instanceof Date
            : true
        )
      )
    )
    .withMessage("Each review must have valid fields."),

  body("categories")
    .optional()
    .isArray()
    .withMessage("Categories must be an array of strings.")
    .custom((categories) =>
      categories.every((category: string) => typeof category === "string")
    )
    .withMessage("Each category must be a string."),

  body("tags")
    .optional()
    .isArray()
    .withMessage("Tags must be an array of strings.")
    .custom((tags) => tags.every((tag: string) => typeof tag === "string"))
    .withMessage("Each tag must be a string."),

  body("sku")
    .exists({ checkFalsy: true })
    .notEmpty()
    .withMessage("SKU is required.")
    .isString()
    .withMessage("SKU must be a string."),

  body("variants")
    .optional()
    .isArray()
    .withMessage("Variants must be an array.")
    .custom((variants) =>
      variants.every(
        (variant: any) =>
          typeof variant.size === "string" &&
          typeof variant.color === "string" &&
          typeof variant.price === "number" &&
          typeof variant.quantity === "number"
      )
    )
    .withMessage("Each variant must have valid fields."),

  body("discount")
    .optional()
    .isObject()
    .withMessage("Discount must be an object.")
    .custom(
      (discount) =>
        typeof discount.percentage === "number" ||
        typeof discount.amount === "number" ||
        discount.expiresAt instanceof Date
    )
    .withMessage("Discount fields must be valid."),

  body("seo")
    .optional()
    .isObject()
    .withMessage("SEO must be an object.")
    .custom(
      (seo) =>
        typeof seo.title === "string" &&
        typeof seo.description === "string" &&
        Array.isArray(seo.keywords) &&
        seo.keywords.every((keyword: string) => typeof keyword === "string")
    )
    .withMessage("SEO fields must be valid."),

  body("availability")
    .optional()
    .isIn(["in-stock", "out-of-stock", "pre-order"])
    .withMessage(
      "Availability must be one of 'in-stock', 'out-of-stock', or 'pre-order'."
    ),

  body("dimensions")
    .optional()
    .isObject()
    .withMessage("Dimensions must be an object.")
    .custom(
      (dimensions) =>
        typeof dimensions.length === "number" &&
        typeof dimensions.width === "number" &&
        typeof dimensions.height === "number"
    )
    .withMessage("Dimensions must have valid numeric fields."),

  body("weight")
    .optional()
    .isFloat({ min: 0 })
    .withMessage("Weight must be a positive number."),

  body("relatedProducts")
    .optional()
    .isArray()
    .withMessage("Related products must be an array of strings.")
    .custom((products) =>
      products.every((product: string) => typeof product === "string")
    )
    .withMessage("Each related product must be a string."),

  body("visibility")
    .optional()
    .isIn(["public", "private"])
    .withMessage("Visibility must be 'public' or 'private'."),

  body("createdAt")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("CreatedAt must be a valid date."),

  body("updatedAt")
    .optional()
    .isISO8601()
    .toDate()
    .withMessage("UpdatedAt must be a valid date."),
];

const parameterValidator = [
  param("id")
    .exists({ checkFalsy: true })
    .notEmpty()
    .isUUID()
    .withMessage("Product identifier is not a correct value."),
];

const productUpdateValidation =
  productInfoValidation.concat(parameterValidator);
//console.log(productUpdateValidation);

export { productInfoValidation, productUpdateValidation, parameterValidator };
