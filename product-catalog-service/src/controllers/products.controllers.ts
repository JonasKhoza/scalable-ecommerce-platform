import { Request, Response } from "express";

const getAllProductsHandler = (req: Request, res: Response) => {
  /*
Purpose: Retrieve all products with optional filters for search, pagination, and sorting.

Steps:
Receive Request: Extract query parameters like search, category, priceRange, page, and sortBy.
Check Cache (Optional):
Check if the results for the given query exist in Redis.
If found, return cached data.
Query Database:
If no cached data, construct a SQL query using filters.
Use ILIKE for case-insensitive search in name or description.
Add ORDER BY for sorting and LIMIT/OFFSET for pagination.
Return Results:
Save the results in Redis for subsequent requests.
Send the product data to the client.

*/
};
const getProductHandler = (req: Request, res: Response) => {
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
};
const createNewProductHandler = (req: Request, res: Response) => {
  /*
    Purpose: Add a new product.

Steps:
Validate Input:
Ensure all required fields (name, description, price, stock_quantity, category_id) are provided and valid.
Insert into Database:
Use a parameterized query to insert the product data into the products table.
Clear Related Cache:
Invalidate Redis cache related to the product list.
Return Confirmation:
Send the created product details back.
    */
};
const updateProductDetails = (req: Request, res: Response) => {
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
};
const deleteProductHandler = (req: Request, res: Response) => {
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
};

export {
  getAllProductsHandler,
  getProductHandler,
  createNewProductHandler,
  updateProductDetails,
  deleteProductHandler,
};
