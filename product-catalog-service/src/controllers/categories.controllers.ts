import { Request, Response } from "express";

const getProcuctsCategory = (req: Request, res: Response) => {
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
};

const createNewProductCategoryHandler = (req: Request, res: Response) => {
  console.log(req.body);
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
};

export { createNewProductCategoryHandler, getProcuctsCategory };
