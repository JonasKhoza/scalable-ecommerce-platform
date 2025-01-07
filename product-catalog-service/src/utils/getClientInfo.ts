import { Request } from "express";

export const getClientInfo = (req: Request) => {
  const clientIP = req.headers["x-forwarded-for"] || req.socket.remoteAddress;
  const userAgent = req.headers["user-agent"] || "Unknown";
  return { clientIP, userAgent };
};

export default getClientInfo;
