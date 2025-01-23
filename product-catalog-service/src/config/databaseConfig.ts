import { Pool } from "pg";
import { Client } from "@elastic/elasticsearch";
import * as dotenv from "dotenv";
dotenv.config();

//console.log("ProcessENV:", process.env);

const pool = new Pool({
  host: process.env.DB_HOST!,
  port: Number(process.env.DB_PORT!),
  database: process.env.DB_NAME!,
  user: process.env.DB_USERNAME!,
  password: process.env.DB_PASSWORD,
  max: 20, //max number of connections in the pool
  idleTimeoutMillis: 30000, //maximum time (in milliseconds) that a connection can be idle before being closed.(30seconds in this case)
  connectionTimeoutMillis: 10000, //the time (in milliseconds) to wait when trying to connect before timing out.(10 seconds in this case)
});

pool.on("error", (err, client) => {
  console.error("Unexpected error on idle client", err, "Client:", client);
  process.exit(-1); // exit the process on pool error
});

pool.on("connect", (client) => {
  console.log("New client connected");
});

pool.on("acquire", (client) => {
  console.log("Client checked out");
});

const onShutDowngracefullyClosePool = () => {
  process.on("SIGNINT", async () => {
    try {
      await pool.end();
      console.log("Pool has ended");
      process.exit(0);
    } catch (err) {
      console.error("Error closing pool:", err);
      process.exit(1);
    }
  });
};

console.log("ELK:", process.env.ELK_USERNAME, process.env.ELK_PASSWORD);
const esClient = new Client({
  cloud: {
    id: process.env.ELK_CLOUD_ID || "",
  },
  auth: {
    apiKey: process.env.ELK_API_KEY || "",
  },
});

export { pool, onShutDowngracefullyClosePool, esClient };
