import { Response } from "express";

import { CustomError } from "../models/error.models";
import { ResponseStructure } from "../models/response.models";

export default function errorResponseHelper(res: Response, err: any) {
  console.log(err);

  if (err instanceof CustomError) {
    const error = {
      code: err.code,
      message: err.message,
      details: err?.details,
    };

    return res
      .status(err.code)
      .json(new ResponseStructure(false, err.code, null, null, error));
  } else {
    const error = {
      code: 500,
      message: "Something went wrong in our servers!",
      details: err,
    };

    return res
      .status(500)
      .json(new ResponseStructure(false, error.code, null, null, error));
  }
}
