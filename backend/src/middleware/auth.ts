import { JwtPayload, NextFunction } from "express";
import { Request, Response } from "express";
import jwt from "jsonwebtoken";
import client from "../db";
export const verifyJwt = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  try {
    const token =
      req.cookies?.accessToken ||
      req.header("Authorization")?.replace("Bearer ", "");
    console.log("in verify jwt", req.cookies.accessToken);
    console.log("req header", req.header("Authorization"));
    if (!token) {
      throw new Error("unauthorized request");
    }
    const decodedToken = jwt.verify(
      token,
      process.env.ACCESS_TOKEN_SECRET_KEY as string
    ) as JwtPayload;

    console.log("decoded token in verify jwt", decodedToken);
    const user = await client.user.findFirst({
      where: {
        id: decodedToken?._id,
      },
    });

    if (!user) {
      throw new Error("invalid access Token");
    }
    console.log("user in verify", user);
    req.user = user.id;
    next();
  } catch (error) {
    console.log(`internal server error ${error}`);
    throw new Error(`internal server error ${error}`);
  }
};

export const adminVerify = async (
  req: Request,
  res: Response,
  next: NextFunction
) => {
  const userId = req.user;
  console.log("admin user", req.user);
  if (!req.user) {
    throw new Error("no user found");
  }
  const existingUser = await client.user.findFirst({
    where: { id: userId },
  });
  if (!existingUser) {
    throw new Error("invalid user");
  }
  if (existingUser?.role != "ADMIN") {
    req.admin = false;
    throw new Error("unauthorized request");
  }

  req.admin = true;
  next();
};
