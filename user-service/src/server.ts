import express from "express";

import authRouters from "./routes/auth.routes";

const port = process.env.PORT || 8000;

const app = express();

//Disable showing of the server laguage in the response headers
app.disable("x-powered-by");

//Parse the incoming data as with contenty-type being json
app.use(express.json());

app.use("/v1/api/users", authRouters);

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
