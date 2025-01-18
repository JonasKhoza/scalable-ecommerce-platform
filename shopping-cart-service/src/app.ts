import express, { Request, Response } from "express";
import * as dotenv from "dotenv";

import cartRoutes from "./routes/cart.routes";

dotenv.config();

const app = express();
//Disable showing of the server laguage in the response headers
app.disable("x-powered-by");

//Parse the incoming data as with contenty-type being json
app.use(express.json());

app.use("/v1/api/carts", cartRoutes);

//Consul health checks
app.get("/health", async (req: Request, res: Response) => {
  res.status(200).json({ status: "UP" }); //Consul relies on the status code, rather than the body.
});

export default app;
