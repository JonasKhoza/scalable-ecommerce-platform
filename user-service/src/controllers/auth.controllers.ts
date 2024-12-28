import { NextFunction, Request, Response } from "express";
import { AuthUserI } from "../models/user.models";
import DBUser from "../models/dbuser.model";
async function testing(req: Request, res: Response) {
  res.json("Yebo!!!");
}

async function createUserHandler(req: Request, res: Response) {
  try {
    const { username, email, password } = req.body as AuthUserI;
    const existingUser = await DBUser.findOne({ email });
    if (existingUser) {
      res.status(400).json({ message: "Email already in use " });
      return;
    }

    console.log(req.body);

    res.status(201).json("Success");
  } catch (err) {
    console.log(err);
  }
}

// Check for existing user
// const existingUser = await DBUser.findOne({});
// if (existingUser) {
//   return res.status(400).json({ message: "Email already in use " });
// }
/*
     This endpoint handles user registration, allowing new users to create an account.
 
     ENSURE IT IS "IDEMPOTENT"
 
     Workflow
       1.Receive User Data: Accept username, email, password, and optional profile fields.
       Validation:
         Ensure all required fields are present.
         Check if email and username are unique.
         Validate the format of the email and password. This includes sending a verification email for the email and sms with OTP to the phone number 
       6.Password Hashing: Use a secure hashing algorithm like bcrypt to hash the password before storing it.
       7.Save to Database: Store the user data in the database.
       8.Response: Return a success message or user data (excluding sensitive fields like the password).
 
       {
        firstName:
        lastName:
        username:
        email:
        password:
        phoneNumber:
       }
 
       */
// }

// async function createUserHandler(req: Request, res: Response) {

// }

function loginUserHandler(req: Request, res: Response) {
  /*
    This endpoint handles user authentication and returns a JWT for authorized access.

    Workflow
      1.Receive Credentials: Accept email and password.
      2.Validation:
        Ensure both fields are provided.
        User Lookup:
        Find the user by email/username in the database.
        If no user exists, return an error.
        Password Validation:
        Compare the provided password with the stored hashed password using bcrypt.
        If the password is incorrect, return an error.
      10.JWT Creation:
      11.Generate a JWT containing the user's ID and other claims.
      12.Sign the JWT with a secret key.
      13.Response: Return the JWT and any additional user info needed for the client.


      {
        username/email,
        password
      }
  */

  const { username, password } = req.body;
  console.log(req.body);

  res.status(200).json("Logged in");
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

export {
  createUserHandler,
  loginUserHandler,
  getUserProfileHandler,
  updateUserProfileHandler,
  testing,
};
