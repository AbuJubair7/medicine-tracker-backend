import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export const verifyToken = (
  req: Request,
  res: Response,
  next: NextFunction,
) => {
  // 1. One-liner to extract token (safely handles missing headers)
  const token = req.headers.authorization?.split(" ")[1];

  if (!token) return res.status(401).json({ error: "No token provided" });

  try {
    // 2. Verify and save to "res.locals" (No need for custom Interfaces!)
    const secret = process.env.JWT_SECRET || "fallback-secret";
    res.locals.user = jwt.verify(token, secret);

    next();
  } catch (error) {
    res.status(401).json({ error: "Invalid token" });
  }
};
