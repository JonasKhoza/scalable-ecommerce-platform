import { Request, Response } from "express";
import { validationResult } from "express-validator";
import { PoolClient } from "pg";
import { pool } from "../config/databaseConfig";
import { Category, CategoryInterface } from "../models/category.models";
import validateUserInputHelper from "../utils/validateUserInputHelper";
import errorResponseHelper from "../utils/errorResponseHelper";
import { ResponseStructure } from "../models/response.models";

const getProcuctsCategory = async (req: Request, res: Response) => {
  console.log("Hit categories");
  /*
    Purpose: List all categories.

Steps:
Check Cache (Optional):
Check Redis for cached category data.
If found, return cached data.
Query Database:
Fetch all categories from the categories table.
Return Results:
Cache the categories in Redis.
Send the categories to the client.

    */
  let connection: PoolClient | null = null;

  try {
    //Get a connection from the pool
    connection = await pool.connect();

    const categoriesResult = await connection.query(
      "SELECT * FROM categories WHERE parent_id IS NULL;"
    );

    const categories = categoriesResult.rows;

    // Return response
    res.status(200).json({
      success: true,
      data: categories,
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    errorResponseHelper(res, err);
  } finally {
    connection?.release();
  }
};

const createNewProductCategoryHandler = async (req: Request, res: Response) => {
  /*
Purpose: Add a new category.

Steps:
Validate Input: Ensure the name and description fields are provided.
Insert into Database:
Use a parameterized query to insert the new category.
Clear Related Cache:
Invalidate Redis cache for categories.
Return Confirmation:
Send the created category details.

*/

  let connection: PoolClient | null = null;
  try {
    //Getting a connection from the pool
    connection = await pool.connect();

    //Create product instace
    const category = new Category(req.body as CategoryInterface);
    //console.log("The instance:", product);

    const validationResults = validationResult(req);

    const results = validateUserInputHelper(validationResults);
    //If validation error
    if (!results.success) {
      throw results;
    }

    // Construct the parameterized query
    const queryText = `INSERT INTO categories 
     (
         name, description, slug, parent_id, image, created_at, updated_at, visibility, 
         seo_metadata, sort_order, is_featured
     ) 
      VALUES
     ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11)`;
    // Parameters to insert from product instance
    const queryParams = [
      category.name,
      category.description,
      category.slug,
      category.parent_id,
      category.image,
      category.created_at,
      category.updated_at,
      category.visibility,
      category.seo_metadata,
      category.sort_order,
      category.is_featured,
    ];

    // Execute the query
    await connection.query(queryText, queryParams);

    res
      .status(201)
      .json(new ResponseStructure(true, 201, "Successfully created product!"));
  } catch (err) {
    errorResponseHelper(res, err);
  } finally {
    //Release the connection top the connection pool
    connection?.release();
  }
};

export { createNewProductCategoryHandler, getProcuctsCategory };
