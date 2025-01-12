import { NextFunction, Request, Response } from "express";
import { CustomError } from "../models/error.models";
import responseHelper from "../utils/errorResponseHelper";

function validateContentType(expectedContentType: string) {
  return (req: Request, res: Response, next: NextFunction) => {
    const receivedContentType = req.headers["content-type"];
    console.log(receivedContentType);

    if (!receivedContentType?.includes(expectedContentType)) {
      responseHelper(
        res,
        new CustomError(
          false,
          `Unsupported Media/Content Type: expected ${expectedContentType}`,
          415
        )
      );

      return;
    }
    //Move to the next middleware
    next();
  };
}

export default validateContentType;
