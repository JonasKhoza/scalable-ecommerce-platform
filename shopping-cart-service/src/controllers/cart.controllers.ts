import { Request, Response } from "express";
import { pool } from "../utils/databaseConfig";
import { UserI } from "../models/user.models";
import { CustomError } from "../models/error.models";
import { ProductInterface } from "../models/cart.models";
import { ResponseI, ResponseStructure } from "../models/response.models";
import { PoolClient } from "pg";
import errorResponseHelper from "../utils/errorResponseHelper";

async function addProductToCartHandler(req: Request, res: Response) {
  let client: PoolClient | null = null;

  try {
    const user: UserI = (req as any).user;
    const { productId } = req.body;

    if (!productId)
      throw new CustomError(false, "Missing productId field.", 400);

    client = await pool.connect();
    //Get the product from the products service
    const PRODUCT_SERVICE_URL = process.env.PRODUCT_SERVICE_URL;

    const results = await fetch(
      `http://${PRODUCT_SERVICE_URL}/:5000/v1/api/products/${productId}`
    );

    if (!results.ok)
      throw new CustomError(
        false,
        "Something went wrong whilst fetching the product.",
        500
      );

    const productResults: ResponseI = await results.json();

    if (!productResults.success)
      throw new CustomError(false, "Product was not found.", 404);

    //OPEN A TRANSACTION

    await client.query("BEGIN");

    // Check if the user has an existing cart
    const cartResult = await client.query(
      "SELECT _id, total_quantity, overall_total_price FROM carts WHERE user_id = $1 AND closed = FALSE",
      [user.userId]
    );

    let cartId;
    if (cartResult.rows.length === 0) {
      // Create a new cart if none exists
      const cartInsert = await client.query(
        "INSERT INTO carts (user_id) VALUES ($1) RETURNING _id",
        [user.userId]
      );
      cartId = cartInsert.rows[0]._id;
    } else {
      cartId = cartResult.rows[0]._id;
    }

    // Check if the product is already in the cart
    const cartItemResult = await client.query(
      "SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2",
      [cartId, productId]
    );

    if (cartItemResult.rows.length > 0) {
      // Update the cart item if it already exists
      const currentItem = cartItemResult.rows[0];
      const updatedQuantity = currentItem.quantity + 1;
      const updatedPrice =
        updatedQuantity * (productResults.data[0] as ProductInterface).price;

      await client.query(
        "UPDATE cart_items SET quantity = $1, total_price = $2 WHERE _id = $3",
        [updatedQuantity, updatedPrice, currentItem._id]
      );

      // Update cart totals
      await client.query(
        "UPDATE carts SET total_quantity = total_quantity + 1, overall_total_price = overall_total_price + $1 WHERE _id = $2",
        [(productResults.data[0] as ProductInterface).price, cartId]
      );
    } else {
      // Add new product to cart
      await client.query(
        "INSERT INTO cart_items (cart_id, product_id, quantity, total_price) VALUES ($1, $2, $3, $4)",
        [
          cartId,
          productId,
          1,
          (productResults.data[0] as ProductInterface).price,
        ]
      );

      // Update cart totals
      await client.query(
        "UPDATE carts SET total_quantity = total_quantity + 1, overall_total_price = overall_total_price + $1 WHERE _id = $2",
        [(productResults.data[0] as ProductInterface).price, cartId]
      );
    }

    //COMMIT TRANSACTION
    await client.query("COMMIT");
    res
      .status(201)
      .json(new ResponseStructure(true, 201, "Successfully added product."));
  } catch (error) {
    //ROLLBACK THE TRANSACTION
    await client?.query("ROLLBACK");
    console.error(error);
    errorResponseHelper(res, error);
  } finally {
    client?.release();
  }
}

async function updateCartProductQuantHandler(req: Request, res: Response) {
  let client: PoolClient | null = null;

  try {
    const { userId }: UserI = (req as any).user;
    const { productId, newQuantity } = req.body as {
      productId: string;
      newQuantity: number;
    };

    //Validate input
    if (!productId.trim() || !newQuantity || isNaN(newQuantity))
      throw new CustomError(false, "Missing productId/newQuantity field.", 400);

    //Get the product from the products service
    const PRODUCT_SERVICE_URL =
      process.env.PRODUCT_SERVICE_URL || "http://localhost:5000";

    const results = await fetch(
      `${PRODUCT_SERVICE_URL}/v1/api/products/${productId}`
    );

    if (!results.ok)
      throw new CustomError(
        false,
        "Something went wrong whilst fetching the product.",
        500
      );

    const productResults: ResponseI = await results.json();

    if (!productResults.success || productResults.data.length < 1)
      throw new CustomError(false, "Product was not found.", 404);

    client = await pool.connect();

    // Get the cart ID for the user
    const cartResult = await client.query(
      "SELECT _id FROM carts WHERE user_id = $1 AND closed = FALSE",
      [userId]
    );

    //Throw if cart not found.
    if (cartResult.rows.length === 0)
      throw new CustomError(false, "Cart not found.", 404);

    const cartId = cartResult.rows[0]._id;
    console.log("CartID: ", cartId);
    // Update the cart item quantity
    const cartItemResult = await client.query(
      "SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2",
      [cartId, productId]
    );

    //Throw error if product not found
    if (cartItemResult.rows.length === 0)
      throw new CustomError(false, "Product not found in cart.", 404);

    const existingItem = cartItemResult.rows[0];
    const quantityChange = newQuantity - existingItem.quantity;
    const updatedPrice =
      newQuantity * (productResults.data[0] as ProductInterface).price;

    // Update cart item
    await client.query(
      "UPDATE cart_items SET quantity = $1, total_price = $2 WHERE _id = $3",
      [newQuantity, updatedPrice, existingItem._id]
    );

    // Update cart totals
    await client.query(
      "UPDATE carts SET total_quantity = total_quantity + $1, overall_total_price = overall_total_price + $2 WHERE _id = $3",
      [
        quantityChange,
        quantityChange * (productResults.data[0] as ProductInterface).price,
        cartId,
      ]
    );

    res.status(200).json(new ResponseStructure(true, 200, "Cart updated"));
  } catch (error) {
    console.error(error);
    errorResponseHelper(res, error);
  } finally {
    client?.release();
  }
}

async function deleteCartProductHandler(req: Request, res: Response) {
  let client: PoolClient | null = null;

  try {
    const { userId }: UserI = (req as any).user;
    const { productId } = req.params;

    //Validate input
    if (!productId.trim())
      throw new CustomError(false, "Missing productId field.", 400);

    client = await pool.connect();
    // Get the cart ID for the user
    const cartResult = await client.query(
      "SELECT _id FROM carts WHERE user_id = $1 AND closed = FALSE",
      [userId]
    );

    //Throw custom error if cart not found
    if (cartResult.rows.length === 0)
      throw new CustomError(false, "Cart not found.", 404);

    const cartId = cartResult.rows[0]._id;

    // Get the cart item
    const cartItemResult = await client.query(
      "SELECT * FROM cart_items WHERE cart_id = $1 AND product_id = $2",
      [cartId, productId]
    );

    //Throw custom error if product not found in cart
    if (cartItemResult.rows.length === 0)
      throw new CustomError(false, "Product not found in cart.", 404);

    const existingItem = cartItemResult.rows[0];

    // Remove the cart item
    await client.query("DELETE FROM cart_items WHERE _id = $1", [
      existingItem._id,
    ]);

    // Update cart totals
    await client.query(
      "UPDATE carts SET total_quantity = total_quantity - $1, overall_total_price = overall_total_price - $2 WHERE _id = $3",
      [existingItem.quantity, existingItem.total_price, cartId]
    );

    res
      .status(200)
      .json(new ResponseStructure(true, 200, "Product removed from cart"));
  } catch (error) {
    console.error(error);
    errorResponseHelper(res, error);
  } finally {
    client?.release();
  }
}

async function retrieveCartHandler(req: Request, res: Response) {
  let client: PoolClient | null = null;
  try {
    const { userId }: UserI = (req as any).user;
    const { cartId } = req.params;

    if (!cartId.trim())
      throw new CustomError(
        false,
        "Need to provide valid cart parameter.",
        400
      );

    client = await pool.connect();

    //SATRT A TRANSACTION
    await client.query("BEGIN");

    const cartResults = await client.query(
      "SELECT _id FROM carts WHERE _id = $1 AND closed = FALSE",
      [cartId]
    );

    //Cart availability status
    let cartMessage: string | null = null;
    let userCart: string | null = null;

    if (cartResults.rows.length === 0) {
      // Create a new cart if none exists
      const createdCartResults = await client.query(
        "INSERT INTO carts (user_id) VALUES ($1) RETURNING _id",
        [userId]
      );
      userCart = createdCartResults.rows[0]._id;
      cartMessage = "No cart found. New empty cart created.";
    } else {
      userCart = cartResults.rows[0]._id;
      cartMessage = "Cart successfully retrieved.";
    }

    //Populate the cart and send it back
    //POPULATE THE PRODUCT
    const query = `
    WITH cart_items AS (
    SELECT
        ci._id AS cart_items_id,ci.*,p._id AS product_id,
        p.*
    FROM cart_items ci
    INNER JOIN products p ON ci.product_id = p._id
    WHERE ci.cart_id = $1
    )
    SELECT
    ci.*,
    c._id AS _id,
    c.user_id,
    c.total_quantity,
    c.overall_total_price, c.closed, c.created_at, c.updated_at
    FROM cart_items ci
    INNER JOIN carts c ON ci.cart_id = c._id;
    `;

    const queryResults = await client.query(query, [userCart]);

    //COMMIT THE TRANSACTION
    await client.query("COMMIT");

    res.status(200).json(
      new ResponseStructure(
        true,
        200,
        {
          cart: queryResults.rows,
        },
        cartMessage
      )
    );
  } catch (error) {
    //ROLLBACK THE TRANSACTION
    await client?.query("ROLLBACK");
    console.log(error);
    errorResponseHelper(res, error);
  } finally {
    client?.release();
  }
}

async function deleteCartHandler(req: Request, res: Response) {
  let client: PoolClient | null = null;

  try {
    const { userId }: UserI = (req as any).user;

    client = await pool.connect();

    // Start a transaction
    await client.query("BEGIN");

    const cartResults = await client.query(
      "SELECT _id FROM carts WHERE user_id = $1 AND closed = FALSE",
      [userId]
    );

    const cartId = cartResults.rows[0]._id;

    // Check if the cart exists
    const cartResult = await client.query(
      "SELECT _id FROM carts WHERE cart_id = $1",
      [cartId]
    );

    if (cartResult.rows.length === 0) {
      // Rollback and respond with a not-found error
      await client.query("ROLLBACK");

      throw new CustomError(false, "Cart not found.", 404);
    }

    // Delete the cart (associated cart_items will be deleted through ON DELETE CASCADE is set)
    await client.query("DELETE FROM carts WHERE _id = $1", [
      cartResult.rows[0]._id,
    ]);

    // Commit the transaction
    await client.query("COMMIT");

    res
      .status(200)
      .json(new ResponseStructure(true, 200, "Successfully removed cart."));
  } catch (error) {
    // Rollback the transaction in case of errors
    await client?.query("ROLLBACK");
    console.error(error);

    errorResponseHelper(res, error);
  } finally {
    // Release the client
    client?.release();
  }
}

export {
  addProductToCartHandler,
  updateCartProductQuantHandler,
  deleteCartProductHandler,
  retrieveCartHandler,
  deleteCartHandler,
};
