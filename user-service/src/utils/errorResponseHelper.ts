import { Response } from "express";

import { CustomError } from "../models/error.models";
import { ResponseStructure } from "../models/response.models";

export default function responseHelper(res: Response, err: any) {
  console.log(err);

  if (err instanceof CustomError) {
    const error = {
      code: err.code,
      message: err.message,
    };

    return res
      .status(err.code)
      .json(new ResponseStructure(false, null, null, error));
  } else {
    const error = {
      code: 500,
      message: "Something went wrong in our servers!",
      details: err?.error,
    };

    return res
      .status(500)
      .json(new ResponseStructure(false, null, null, error));
  }
}
