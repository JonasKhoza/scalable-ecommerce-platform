import { PoolClient } from "pg";
import cron from "node-cron";

import * as dotenv from "dotenv";

import { esClient, pool } from "../config/databaseConfig";

dotenv.config();
//console.log("This is the(outside) ENVS:", process.env);
async function syncProductsToElasticsearch() {
  //console.log("This is the ENVS:", process.env);
  console.log("Starting product sync...");
  let connection: PoolClient | null = null;

  try {
    //Get a connection
    connection = await pool.connect();

    // Fetch products from the PostgreSQL database
    const productsQuery = "SELECT * FROM products";
    const { rows: products } = await connection.query(productsQuery);
    console.log("Products:", products);
    // Prepare bulk operations for Elasticsearch
    // const bulkOps = products.flatMap((product) => [
    //   { index: { _index: "products", _id: product._id } },
    //   product,
    // ]);

    const bulkOps = products.flatMap((product) => {
      const { _id, ...productBody } = product; // Exclude _id from the document body

      return [
        { index: { _index: "products", _id } }, // Metadata with _id
        productBody, // Document body without _id
      ];
    });

    console.log("Opts:", bulkOps);

    // Perform bulk operation
    const bulkResponse = await esClient.bulk({
      refresh: true,
      body: bulkOps,
    });

    console.log("The bulk response:", bulkResponse);

    // Check for errors in the bulk operation
    if (bulkResponse.errors) {
      const erroredDocuments = bulkResponse.items.filter(
        (item: any) => item.index && item.index.error
      );
      console.error(
        "Some documents failed to sync:",
        erroredDocuments[0]?.index?.error
      );
    } else {
      console.log("Products synced to Elasticsearch successfully!");
    }
  } catch (error) {
    console.error("Error syncing products to Elasticsearch:", error);
  } finally {
    connection?.release();
  }
}

//Schedule the sync job to run every 15 minutes
cron.schedule("*/15 * * * *", async () => {
  console.log("Running scheduled product sync...");
  await syncProductsToElasticsearch();
});

// const run = () => {
//   return async () => {
//     await syncProductsToElasticsearch();
//   };
// };

// run()();
