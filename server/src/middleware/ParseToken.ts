import jwt from "jsonwebtoken";
import { Request, Response, NextFunction } from "express";

export const ParseToken = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  if (!req.headers.authorization) return next();

  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return next();

  try {
    const { id } = <any>jwt.verify(token, process.env.JWT_SECRET!);

    if (!id) {
      return res.status(400).send({ error: "No id found in token" });
    }

    res.locals.userId = id;
    res.locals.token = token;
    next();
  } catch (error) {
    return next();
  }
};
