import express from "express";
import * as dotenv from "dotenv";
import orderRoutes from "./routes/order.routes";

dotenv.config();

const app = express();

//Parse the incoming data as with contenty-type being json
app.use(express.json());

//Disable showing of the server laguage in the response headers
app.disable("x-powered-by");

//Register order routes
app.use("/v1/api/orders", orderRoutes);

export default app;
