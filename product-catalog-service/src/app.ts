import express from "express";
import cookieParser from "cookie-parser";
import * as dotenv from "dotenv";
dotenv.config();

import productsRoutes from "./routes/products.routes";
import categoriesRoutes from "./routes/categories.routes";

const app = express();
//Disable showing of the server laguage in the response headers
app.disable("x-powered-by");

//Parse the incoming data as with contenty-type being json
app.use(express.json());
//parse cookies middleware
app.use(cookieParser());
//populate process.env with env

//Routes registrations
app.use("/v1/api/products", productsRoutes);
app.use("/v1/api/categories", categoriesRoutes);

export default app;
