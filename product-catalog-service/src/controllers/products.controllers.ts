import { Request, RequestHandler, Response } from "express";
import { validationResult } from "express-validator";

import Product, { ProductInterface } from "../models/product.models";
import validateUserInputHelper from "../utils/validateUserInputHelper";
import { pool } from "../utils/databaseConfig";
import { PoolClient } from "pg";
import { ResponseStructure } from "../models/response.models";
import errorResponseHelper from "../utils/errorResponseHelper";
import { CustomError } from "../models/error.models";

const getAllProductsHandler: RequestHandler = async (
  req: Request,
  res: Response
) => {
  console.log("Get all products:", req.params);
  console.log("Query:", req.query);

  //   /*
  // Purpose: Retrieve all products with optional filters for search, pagination, and sorting.

  // Steps:
  // Receive Request: Extract query parameters like search, category, priceRange, page, and sortBy.
  // Check Cache (Optional):
  // Check if the results for the given query exist in Redis.
  // If found, return cached data.
  // Query Database:
  // If no cached data, construct a SQL query using filters.
  // Use ILIKE for case-insensitive search in name or description.
  // Add ORDER BY for sorting and LIMIT/OFFSET for pagination.
  // Return Results:
  // Save the results in Redis for subsequent requests.
  // Send the product data to the client.

  // */

  const currentPage: number = Number(req.query.current_page) || 1;
  const pageSize: number = Number(req.query.page_size) || 50;
  const search: string = req.query.search ? String(req.query.search) : "";

  if (currentPage <= 0 || pageSize <= 0 || pageSize > 1000) {
    throw new CustomError(false, "Invalid pagination parameters.", 400);
  }

  const offset = (currentPage - 1) * pageSize;

  let connection: PoolClient | null = null;

  try {
    //Get a connection from the pool
    connection = await pool.connect();

    let totalCountQuery = "SELECT COUNT(*) FROM products";
    let productQuery = `
        SELECT *
        FROM products
        ORDER BY created_at DESC
        LIMIT $1 OFFSET $2
      `;
    let queryParams: (string | number)[] = [pageSize, offset];
    let countParams: any[] = [];

    // Add search condition if applicable
    if (search) {
      totalCountQuery = `
          EXPLAIN SELECT COUNT(*)
          FROM products
          WHERE title ILIKE '%' || $1 || '%' 
          OR description ILIKE '%' || $1 || '%';

        `;
      productQuery = `
          EXPLAIN SELECT *
          FROM products
           WHERE title ILIKE  $1 || '%' 
          OR description ILIKE $1 || '%'
          ORDER BY created_at DESC
          LIMIT $2 OFFSET $3
        `;
      countParams = [search];
      queryParams = [search, pageSize, offset];
    }

    // Execute total count query
    const totalCountResult = await connection.query(
      totalCountQuery,
      countParams
    );
    const totalCount = parseInt(totalCountResult.rows[0].count, 10);

    // Fetch products for the current page
    const productsResult = await connection.query(productQuery, queryParams);
    console.log(productsResult);
    const products = productsResult.rows;

    // Return response
    res.status(200).json({
      success: true,
      data: {
        total_count: totalCount,
        current_page: currentPage,
        page_size: pageSize,
        total_pages: Math.ceil(totalCount / pageSize),
        products,
      },
    });
  } catch (err) {
    console.error("Error fetching products:", err);
    errorResponseHelper(res, err);
  } finally {
    connection?.release();
  }
};

const getProductHandler = async (req: Request, res: Response) => {
  console.log("Got product");
  /*
    Purpose: Retrieve a single product by its ID.

    Steps:
        Receive Request: Extract the id parameter from the URL.
        Check Cache (Optional):
        Check Redis for cached product data.
        If found, return the product data.
        Query Database:
        Query the products table using the ID.
        Handle the case where the product doesn’t exist.
        Return Result:
        Cache the product in Redis.
        Send the product details.

    */
  let connection: PoolClient | null = null;
  try {
    console.log(req.params);
    //Get a connection from the pool
    connection = await pool.connect();

    const validationResults = validationResult(req);

    const results = validateUserInputHelper(validationResults);
    //If validation error
    if (!results.success) {
      throw results;
    }

    const { id } = req.params;

    const productQuery = "SELECT * FROM products WHERE _id = $1";

    const productQueryResult = await connection.query(productQuery, [id]);
    const product = productQueryResult.rows;

    if (!product) {
      res
        .status(404)
        .json(new ResponseStructure(false, 404, "Product was not found."));
      return;
    }

    res.status(200).json(new ResponseStructure(true, 200, product));
  } catch (err: any) {
    console.error("Error fetching product:", err);

    const error = new CustomError(false, "Product was not found.", 404, err);

    if (err.code == "22P02") {
      errorResponseHelper(res, error);
      return;
    }
    errorResponseHelper(res, err);
  } finally {
    connection?.release();
  }
};
const createNewProductHandler = async (req: Request, res: Response) => {
  /*
    Purpose: Add a new product.

Steps:
Validate Input:
Ensure all required fields (name, description, price, stock_quantity, category_id) are provided and valid.
Insert into Database:
Use a parameterized query to insert the product data into the products table.
ENSURE ATOMICITY
Clear Related Cache:
Invalidate Redis cache related to the product list.
Return Confirmation: 
Send the created product details back.
    */

  let connection: PoolClient | null = null;
  try {
    //Getting a connection from the pool
    connection = await pool.connect();
    //begin a transaction
    await connection.query("BEGIN");

    //Create product instace
    const product = new Product(req.body as ProductInterface);
    //console.log("The instance:", product);

    const validationResults = validationResult(req);

    const results = validateUserInputHelper(validationResults);
    //If validation error
    if (!results.success) {
      throw results;
    }

    // Construct the parameterized query
    const queryText = `INSERT INTO products 
                                (
                                    title, image, summary, old_price, price, description, color, quantity, 
                                    special, brand, reviews, categories, tags, sku, variants, discount, seo, 
                                    availability, dimensions, weight, related_products, visibility
                                ) 
                      VALUES
                                ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, $21, $22);`;
    // Parameters to insert from product instance
    const queryParams = [
      product.title,
      product.image,
      product.summary,
      product.oldPrice,
      product.price,
      product.description,
      product.color,
      product.quantity,
      product.special,
      product.brand,
      JSON.stringify(product.reviews || []),
      product.categories,
      product.tags,
      product.sku,
      JSON.stringify(product.variants || []),
      JSON.stringify(product.discount || {}),
      JSON.stringify(product.seo || {}),
      product.availability,
      JSON.stringify(product.dimensions || {}),
      product.weight,
      product.relatedProducts,
      product.visibility,
    ];

    // Execute the query
    const result = await connection.query(queryText, queryParams);
    // await connection.query(
    //   "CREATE INDEX title_description_index ON products (title, description) IF NOT EXISTS;"
    // );
    //console.log(result);

    //commit transaction
    await connection.query("COMMIT");

    res.status(201).json(new ResponseStructure(true, 201, result.rowCount));
  } catch (err) {
    await connection?.query("ROLLBACK");
    errorResponseHelper(res, err);
  } finally {
    //Release the connection top the connection pool
    connection?.release();
  }
};
const updateProductDetails = async (req: Request, res: Response) => {
  console.log("Update product details");
  /*
    Purpose: Update an existing product.

Steps:
Receive Request: Extract the id from the URL and the updated fields from the body.
Validate Input: Ensure at least one field is provided for the update.
Update Database:
Use a parameterized query to update the products table.
Handle the case where the product doesn’t exist.
Clear Related Cache:
Invalidate cache for the specific product and product list.
Return Confirmation:
Send the updated product details.
    */

  let connection: PoolClient | null = null;
  try {
    console.log(req.body);
    const validationResults = validationResult(req);
    console.log(validationResults);
    const results = validateUserInputHelper(validationResults);

    //If validation error
    if (!results.success) {
      throw results;
    }

    //Getting a connection from the pool
    connection = await pool.connect();

    //begin a transaction
    await connection.query("BEGIN");

    const { id } = req.params;

    const productQuery = "SELECT * FROM products WHERE _id = $1";

    const productQueryResult = await connection.query(productQuery, [id]);
    const lookedProduct = productQueryResult.rows;

    if (lookedProduct.length === 0) {
      res
        .status(404)
        .json(new ResponseStructure(false, 404, "Product was not found."));
      return;
    }

    //Create product instace
    const product = new Product(req.body as ProductInterface);
    //console.log("The instance:", product);

    //// Construct the parameterized query
    const queryText = `UPDATE products
SET 
  title = $1, image = $2, summary = $3, old_price = $4, price = $5, 
  description = $6, color = $7, quantity = $8, special = $9, brand = $10, 
  reviews = $11, categories = $12, tags = $13, sku = $14, variants = $15, 
  discount = $16, seo = $17, availability = $18, dimensions = $19, 
  weight = $20, related_products = $21, visibility = $22
WHERE _id = $23;
`;
    // Parameters to insert from product instance
    const queryParams = [
      product.title,
      product.image,
      product.summary,
      product.oldPrice,
      product.price,
      product.description,
      product.color,
      product.quantity,
      product.special,
      product.brand,
      JSON.stringify(product.reviews || []),
      product.categories,
      product.tags,
      product.sku,
      JSON.stringify(product.variants || []),
      JSON.stringify(product.discount || {}),
      JSON.stringify(product.seo || {}),
      product.availability,
      JSON.stringify(product.dimensions || {}),
      product.weight,
      product.relatedProducts,
      product.visibility,
      id,
    ];

    // Execute the query
    const result = await connection.query(queryText, queryParams);
    // await connection.query(
    //   "CREATE INDEX title_description_index ON products (title, description) IF NOT EXISTS;"
    // );
    //console.log(result);

    //commit transaction
    await connection.query("COMMIT");

    if (result.rowCount === 0) {
      res
        .status(404)
        .json(new ResponseStructure(false, 404, "Product update failed."));
      return;
    }

    res
      .status(200)
      .json(new ResponseStructure(true, 200, "Product updated successfully."));
  } catch (err: any) {
    await connection?.query("ROLLBACK");
    console.error("Error fetching product:", err);

    const error = new CustomError(false, "Product was not found.", 404, err);

    if (err.code == "22P02") {
      errorResponseHelper(res, error);
      return;
    }

    errorResponseHelper(res, err);
  } finally {
    //Release the connection top the connection pool
    connection?.release();
  }
};
const deleteProductHandler = async (req: Request, res: Response) => {
  console.log("Deleting a product");
  /*
Purpose: Delete a product.

Steps:
Receive Request: Extract the id from the URL.
Delete from Database:
Perform a soft delete (e.g., set a deleted_at column) or a hard delete.
Handle cases where the product doesn’t exist.
Clear Related Cache:
Invalidate cache for the specific product and product list.
Return Confirmation:
Send a success message.
    */
  let connection: PoolClient | null = null;
  try {
    console.log(req.body);
    //Validate parameter
    const validationResults = validationResult(req);
    console.log(validationResults);
    const results = validateUserInputHelper(validationResults);

    //If validation error
    if (!results.success) {
      throw results;
    }

    //Getting a connection from the pool
    connection = await pool.connect();

    const { id } = req.params;

    const productQuery = "DELETE FROM products WHERE _id = $1";

    const productDeleteQueryResult = await connection.query(productQuery, [id]);

    if (productDeleteQueryResult.rowCount === 0) {
      res
        .status(404)
        .json(new ResponseStructure(false, 404, "Product delete failed."));
      return;
    }

    res
      .status(200)
      .json(new ResponseStructure(true, 200, "Product deteted successfully."));
  } catch (err: any) {
    console.error("Error deleting product:", err);

    const error = new CustomError(false, "Product was not found.", 404, err);

    if (err.code == "22P02") {
      errorResponseHelper(res, error);
      return;
    }

    errorResponseHelper(res, err);
  } finally {
    //Release the connection top the connection pool
    connection?.release();
  }
};

export {
  getAllProductsHandler,
  getProductHandler,
  createNewProductHandler,
  updateProductDetails,
  deleteProductHandler,
};
