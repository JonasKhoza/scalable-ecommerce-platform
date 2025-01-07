import { body } from "express-validator";

const categoryValidator = [
  // Validate 'name' field
  body("name")
    .isString()
    .withMessage("Name must be a string.")
    .notEmpty()
    .withMessage("Name is required.")
    .isLength({ max: 255 })
    .withMessage("Name must be less than 255 characters."),

  // Validate 'description' field (optional)
  body("description")
    .optional()
    .isString()
    .withMessage("Description must be a string.")
    .isLength({ max: 1000 })
    .withMessage("Description must be less than 1000 characters."),

  // Validate 'slug' field
  body("slug")
    .isString()
    .withMessage("Slug must be a string.")
    .notEmpty()
    .withMessage("Slug is required.")
    .isLength({ max: 255 })
    .withMessage("Slug must be less than 255 characters.")
    .matches(/^[a-z0-9-]+$/)
    .withMessage(
      "Slug must only contain lowercase letters, numbers, and hyphens."
    ),

  // Validate 'parent_id' field (optional)
  body("parent_id")
    .optional()
    .isUUID()
    .withMessage("Parent ID must be a valid UUID."),

  // Validate 'image' field (optional)
  body("image")
    .optional()
    .isString()
    .withMessage("Image must be a string.")
    .isURL()
    .withMessage("Image must be a valid URL."),

  // Validate 'visibility' field
  body("visibility")
    .optional()
    .isBoolean()
    .withMessage("Visibility must be a boolean."),

  // Validate 'seo_metadata' field (optional, JSON object)
  body("seo_metadata")
    .optional()
    .isObject()
    .withMessage("SEO metadata must be a valid object."),

  // Validate 'sort_order' field (optional)
  body("sort_order")
    .optional()
    .isInt({ min: 1 })
    .withMessage("Sort order must be an integer greater than or equal to 1."),

  // Validate 'is_featured' field (optional)
  body("is_featured")
    .optional()
    .isBoolean()
    .withMessage("Is featured must be a boolean."),
];

export { categoryValidator };
