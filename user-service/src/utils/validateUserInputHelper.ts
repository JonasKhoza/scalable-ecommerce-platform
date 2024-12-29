import { Result, ValidationError } from "express-validator";
import { ResponseI } from "../models/response.models";
import { CustomError } from "../models/error.models";
// import expressValidator from "express-validator";
// const { Result, ValidationError } = expressValidator;

export default function validateUserInputHelper(
  results: Result<ValidationError>
) {
  if (!results.isEmpty()) {
    return new CustomError(false, "Validation error!", 400, results.array());
  } else {
    const response: ResponseI = {
      success: true,
    };
    return response;
  }
}
