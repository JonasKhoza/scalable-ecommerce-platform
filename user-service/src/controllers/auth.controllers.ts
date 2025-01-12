import { Request, Response } from "express";
import { validationResult } from "express-validator";
import * as bcrypt from "bcrypt";
import jwt from "jsonwebtoken";

import { AuthUserI, DBUser, TokenInt } from "../models/user.models";
import { CustomError } from "../models/error.models";
import responseHelper from "../utils/errorResponseHelper";
import validateUserInputHelper from "../utils/validateUserInputHelper";
import { ResponseStructure } from "../models/response.models";
import errorResponseHelper from "../utils/errorResponseHelper";
import { DBTokenI, Token } from "../models/token.model";
import getClientInfo from "../utils/getClientInfo";

async function createUserHandler(req: Request, res: Response) {
  /*
     This endpoint handles user registration, allowing new users to create an account.
 
     ENSURE IT IS "IDEMPOTENT"
 
     Workflow
       1.Receive User Data: Accept username, email, password, and optional profile fields.
       Validation:
         Ensure all required fields are present.
         Check if email and username are unique.
         Validate the format of the email and password. 
       2.Password Hashing: Use a secure hashing algorithm like bcrypt to hash the password before storing it.
       3.Save to Database: Store the user data in the database.
       4.Response: Return a success message or user data (excluding sensitive fields like the password).
 
       {
        firstName:
        lastName:
        username:
        email:
        password:
        phoneNumber:
       }
 
       */
  try {
    //Step 1: VALIDATION

    //Get the input validation results from express validator middleware
    const validationResults = validationResult(req);
    //Get condition of results
    const result = validateUserInputHelper(validationResults);

    //Check condition of results
    if (!result.success) {
      //If error, then throw the error
      throw result;
    }

    //Get user data from the request
    const {
      firstname,
      lastname,
      username,
      email,
      password,
      phonenumber,
      numcountrycode,
    } = req.body as AuthUserI;

    //Check if it's an existing user
    const parameter = email || username;
    const existingUser = await DBUser.findOne({ parameter });

    if (existingUser) {
      //User already exists
      throw new CustomError(false, "User already exists!!", 409);
    }

    //If username, check if it is taken
    const existingUsername = await DBUser.findOne({ username });
    if (existingUsername) {
      //User already exists
      throw new CustomError(false, "Username is taken!", 409);
    }

    //STEP 2: HASH PASSWORD
    if (
      isNaN(Number(process.env.P_HASH_KEY!)) ||
      Number(process.env.P_HASH_KEY!) <= 0
    ) {
      throw new Error(
        "Invalid salt rounds. Please check the P_HASH_KEY environment variable."
      );
    }

    const hashedPassword = String(
      await bcrypt.hash(password, Number(process.env.P_HASH_KEY!))
    );

    const user = new DBUser({
      username,
      email,
      password: hashedPassword,
      firstname,
      lastname,
      phonenumber,
      numcountrycode,
      isAdmin: false,
    });

    await user.save();

    res
      .status(201)
      .json(new ResponseStructure(true, 201, "User is succesfully created."));
  } catch (err) {
    console.log(err);
    responseHelper(res, err);
    return;
  }
}

async function loginUserHandler(req: Request, res: Response) {
  /*
    This endpoint handles user authentication and returns a JWT for authorized access.

    Workflow
      1.Receive Credentials: Accept email/username and password.
      2.Validation:
        Ensure all fields are provided.
      3. Check if a user is already logged in
      4.User Lookup:
        Find the user by email/username in the database.
        If no user exists, return an error.
      5.Password Validation:
        Compare the provided password with the stored hashed password using bcrypt.
        If the password is incorrect, return an error.
      6.JWT Creation:
      7.Generate a JWT containing the user's ID and other claims.
      8.Sign the JWT with a secret key.
      9.Response: Return the JWT and any additional user info needed for the client.


      {
        username/email,
        password
      }
  */
  try {
    //Get the input validation results from express validator middleware
    const validationResults = validationResult(req);
    //Get condition of results
    const result = validateUserInputHelper(validationResults);

    //Check condition of results
    if (!result.success) {
      //If error, then throw the error
      throw result;
    }

    const { username, email, password } = req.body;

    //Check users existence in the database
    const parameter = email
      ? { email: email }
      : username
      ? { username: username }
      : { email };

    const existingUser = await DBUser.findOne(parameter);

    if (!existingUser) {
      //User already exists
      throw new CustomError(false, "User does not exists!!", 404);
    }

    //Validate password

    const passwordMatched = await bcrypt.compare(
      password,
      existingUser.password
    );

    if (!passwordMatched) {
      throw new CustomError(false, "Passwords do not match.", 400);
    }

    //Generate an access token
    const accessToken = jwt.sign(
      {
        userId: existingUser._id,
        userRole: existingUser.isAdmin,
        createdAt: existingUser.createdAt,
        updatedAt: existingUser.updatedAt,
      },
      String(process.env.ACCESS_TOKEN_SECRET!),
      { algorithm: "HS256", expiresIn: "15min" }
    );

    //Generate a refresh token
    const refreshToken = jwt.sign(
      {
        userId: existingUser._id,
        userRole: existingUser.isAdmin,
        createdAt: existingUser.createdAt,
        updatedAt: existingUser.updatedAt,
      },
      String(process.env.REFRESH_TOKEN_SECRET!),
      { algorithm: "HS256", expiresIn: "1d" }
    );

    //Save refresh token to the database
    // Get client identifications
    const { clientIP, userAgent } = getClientInfo(req);
    console.log(clientIP, userAgent);

    //Generate refreshToken expiry time

    const refreshTokenExpiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

    const token = new Token({
      token: String(refreshToken),
      user: existingUser._id,
      expiresAt: refreshTokenExpiryTime, // 1 day from now
      deviceInfo: { clientIP: clientIP, clientUserAgent: userAgent },
    });

    await token.save();

    //Set refresh token as an httpOnly and Secure cookie
    res.cookie("refreshToken", String(refreshToken), {
      expires: refreshTokenExpiryTime,
      path: "/",
      sameSite: "lax",
      secure: false, //defines the cookie as https only
      httpOnly: true,
    });

    //Send back access token as json

    res.status(200).json(new ResponseStructure(true, 200, accessToken));
  } catch (err) {
    errorResponseHelper(res, err);
  }
}

function getUserProfileHandler(req: Request, res: Response) {
  /*

    This endpoint retrieves the authenticated user's profile.

    GET /api/users/profile
    Authorization: Bearer <jwt_token>

    Authorization: Requires a valid JWT (JSON Web Token).
    Validation: Validate the provided data first using "express-validator"
    Response:
    Returns the profile data stored in the database for the authenticated user.

    

    */
  //MVP: username and email
  //ADVANCED
  //Personal details:  Full Name, Email Address, Phone number
  //Addresses: {Receptient Name, Recipient Number, street name, complex/building?, suburb, city/Town, province, postal code}[]
  res.status(200).json("Got profile");
}

function updateUserProfileHandler(req: Request, res: Response) {
  /*
    This endpoint allows the authenticated user to update their profile details.

    Authorization: Requires a valid JWT.
    Request Body:
    Only include fields the user is allowed to update (e.g., full_name, phone_number, addresses, etc.).
    Validation:
    Ensure the data is valid (e.g., correct phone number format, required fields are not empty).
    Response: Provide the new updated data back along with the timestamps
*/

  console.log(req.body);

  res.status(201).json("Updated profile");
}

async function refreshToken(req: Request, res: Response) {
  try {
    //Access refresh token the cookie
    const refreshToken = req.cookies?.refreshToken;

    console.log("Hit!");

    if (!refreshToken) {
      throw new CustomError(false, "Refresh token not provided", 401);
    }

    //Verify the refresh token's signature, expiration, and presence in the database.
    let refreshUser: any = null;
    try {
      refreshUser = jwt.verify(
        String(refreshToken),
        String(process.env.REFRESH_TOKEN_SECRET!)
      );

      console.log(refreshUser);
    } catch (err: any) {
      throw new CustomError(
        false,
        "Invalid or expired refresh token.",
        403,
        err
      );
    }

    //Check the token against what is in the database
    const storedToken: TokenInt | null = await Token.findOne({
      token: refreshToken,
    });

    if (!storedToken)
      throw new CustomError(false, "Invalid refresh token", 403);

    // GENERATE NEW ACCESS TOKENS
    //Generate an access token
    const newAccessToken = jwt.sign(
      {
        userId: refreshUser.userId,
        userRole: refreshUser.userRole,
        createdAt: refreshUser.createdAt,
        updatedAt: refreshUser.updatedAt,
      },
      process.env.ACCESS_TOKEN_SECRET!,
      { algorithm: "HS256", expiresIn: "15min" }
    );

    //Generate a refresh token
    const newRefreshToken = jwt.sign(
      {
        userId: refreshUser.userId,
        userRole: refreshUser.userRole,
        createdAt: refreshUser.createdAt,
        updatedAt: refreshUser.updatedAt,
      },
      process.env.REFRESH_TOKEN_SECRET!,
      { algorithm: "HS256", expiresIn: "1d" }
    );

    // Save refresh token to the database
    // Get client IP
    const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
    // Get User-Agent
    const userAgent = req.headers["user-agent"];

    //Generate refreshToken expiry time
    const refreshTokenExpiryTime = new Date(Date.now() + 24 * 60 * 60 * 1000);

    await Token.updateMany(
      { token: refreshToken },
      {
        $set: {
          token: newRefreshToken,
          user: storedToken.userId,
          expiresAt: refreshTokenExpiryTime, // 1 day from now
          deviceInfo: { clientIP: clientIP, clientUserAgent: userAgent },
        },
      }
    );

    //Clear the existing cookie first
    res.clearCookie("refreshCookie");

    //Set refresh token as an httpOnly and Secure cookie
    res.cookie("refreshToken", String(newRefreshToken), {
      expires: refreshTokenExpiryTime,
      path: "/",
      sameSite: "lax",
      secure: false, //defines the cookie as https only
      httpOnly: true,
    });

    //Send back access token as json
    res
      .status(200)
      .json(new ResponseStructure(true, 200, String(newAccessToken)));
  } catch (err) {
    errorResponseHelper(res, err);
  }
}

export {
  createUserHandler,
  loginUserHandler,
  getUserProfileHandler,
  updateUserProfileHandler,
  refreshToken,
};
