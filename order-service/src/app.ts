import express from "express";
import * as dotenv from "dotenv";

dotenv.config();

const app = express();
//Disable showing of the server laguage in the response headers
app.disable("x-powered-by");

//Parse the incoming data as with contenty-type being json
app.use(express.json());

export default app;
