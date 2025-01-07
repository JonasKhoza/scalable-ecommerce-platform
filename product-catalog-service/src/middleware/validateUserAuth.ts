import { NextFunction, Request, Response } from "express";

import jwt from "jsonwebtoken";
import * as dotenv from "dotenv";

import getClientInfo from "../utils/getClientInfo";
import { CustomError } from "../models/error.models";
import errorResponseHelper from "../utils/errorResponseHelper";
import { UserI } from "../models/user.models";

dotenv.config();

const authenticate = (req: Request, res: Response, next: NextFunction) => {
  try {
    //Collect user info
    const { clientIP, userAgent } = getClientInfo(req);
    //Log the user details
    console.log(clientIP, userAgent);

    //Get the access token
    const authHeader = req.headers.authorization;

    const accessToken = authHeader && authHeader?.split(" ")[1];

    //If token is absent
    if (!accessToken) throw new CustomError(false, "Token not provided.", 401);

    //If provided a token, verify the token
    jwt.verify(accessToken, process.env.ACCESS_TOKEN_SECRET!, (err, user) => {
      if (err)
        throw new CustomError(false, "Invalid or expired token", 403, err);
      console.log("We're here:", user);
      //Check for admin priviledges
      if (!(user as UserI).userRole)
        throw new CustomError(
          false,
          "Need to be admin to access this route",
          400,
          err
        );

      //Pass the user
      (req as any).user = user;
      console.log("The user:", user);
      next();
    });
  } catch (err) {
    errorResponseHelper(res, err);
  }
};

export default authenticate;
