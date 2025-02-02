import { PoolClient } from "pg";

import { pool } from "../utils/databaseConfig"; // Adjust the path as needed
import { CustomError } from "./error.models";
import { ResponseStructure } from "./response.models";

class Order {
  cart: string | null;
  user: string | null; // UUID instead of ObjectId
  status: string;
  orderId?: string;

  constructor(
    cart: string | null,
    user: string | null,
    status = "pending",
    orderId?: string
  ) {
    this.cart = cart;
    this.user = user;
    this.status = status;
    this.orderId = orderId;
  }

  // Fetch all orders for a user
  static async findAllOrdersForUser(userId: string) {
    const query = `
    SELECT * FROM orders WHERE user_id = $1
`;
    try {
      const { rows } = await pool.query(query, [userId]);

      if (rows.length <= 0)
        return new CustomError(false, "Orders not found.", 404);

      return rows; // Return orders with associated cart details
    } catch (err) {
      return new CustomError(
        false,
        "Something wen't wrong in our serrver whilst hitting the database.",
        500,
        err
      );
    }
  }

  // Fetch a single order by ID
  static async findOrderById(orderId: string) {
    const query = `
   SELECT * FROM orders 
   WHERE _id = $1 
   ORDER BY created_at DESC
  `;

    try {
      const { rows } = await pool.query(query, [orderId]);
      if (rows.length <= 0)
        return new CustomError(false, "Order not found.", 404);
      return rows; // Return detailed order info
    } catch (err) {
      return new CustomError(
        false,
        "Something went wrong whilst reach the database.",
        500,
        err
      );
    }
  }

  // Save or update an order
  async saveOrder() {
    let client: PoolClient | null = null;
    try {
      //Get a connection from the pool
      client = await pool.connect();

      //START A TRANSACTION
      await client.query("BEGIN");

      if (this.orderId) {
        // Update an existing order by admin
        const query = `
              UPDATE orders
              SET status = $1, updated_at = NOW()
              WHERE _id = $2 
            `;
        await client.query(query, [this.status, this.orderId]);

        await client.query("COMMIT");
        return new ResponseStructure(true, 200, "Order updated successfully.");
      } else {
        //Ensure IDEMPOTENCY by checking the existency of the cart
        const results = await client.query(
          "SELECT cart_id FROM orders WHERE cart_id = $1",
          [this.cart]
        );

        if (results.rows.length > 0)
          return new CustomError(
            false,
            "Cart already exists in an an existing order.",
            400
          );

        // Insert a new order
        const query = `
              INSERT INTO orders (cart_id, user_id, status, created_at, updated_at)
              VALUES ($1, $2, $3, NOW(), NOW())
              RETURNING _id
            `;
        const values = [this.cart, this.user, this.status];

        const { rows } = await client.query(query, values);
        //Commit the transction
        await client.query(" COMMIT");

        return new ResponseStructure(true, 202, {
          message: "Order successfully created.",
          _id: rows[0],
        }); // Return the newly created order
      }
    } catch (err) {
      await client?.query("ROLLBACK");

      return new CustomError(false, "Database operation failed.", 500, err);
    } finally {
      client?.release();
    }
  }
}

export { Order };
