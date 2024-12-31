import express from "express";
import * as dotenv from "dotenv";
import cookieParser from "cookie-parser";

import authRouters from "./routes/auth.routes";
import verifyRoutes from "./routes/verify.routes";
import connectDB from "./data/database";

//Populate the process object with our env variables
dotenv.config();

const port = process.env.PORT || 8000;

const app = express();

//Connect to the database first
connectDB();

//Disable showing of the server laguage in the response headers
app.disable("x-powered-by");

//Parse the incoming data as with contenty-type being json
app.use(express.json());
//parse cookies middleware
app.use(cookieParser());

app.use("/v1/api/users", authRouters);
app.use("/v1/api/users/verify", verifyRoutes);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
