import { Request, Response } from "express";
import client from "../db";
import jwt from "jsonwebtoken";
import { JwtPayload } from "express";
import bcrypt from "bcrypt";

const options = {
  httpOnly: true,
  secure: true, // Must be true when SameSite is 'None'
  sameSite: "none" as "none", // Explicitly set 'none'
};
async function generateAccessAndRefreshToken(userId: number) {
  const user = await client.user.findFirst({
    where: {
      id: userId,
    },
  });

  if (!user) {
    throw new Error("no user found");
  }
  try {
    const { id, name, email } = user;

    const payload: JwtPayload = {
      _id: id,
      name: name,
      email: email,
    };
    if (
      !process.env.ACCESS_TOKEN_SECRET_KEY ||
      !process.env.REFRESH_TOKEN_SECRET_KEY ||
      !process.env.REFRESH_TOKEN_EXPIRY ||
      !process.env.ACCESS_TOKEN_EXPIRY
    ) {
      throw new Error("Secret keys are missing in environment variables");
    }
    console.log(
      process.env.ACCESS_TOKEN_SECRET_KEY,
      process.env.REFRESH_TOKEN_SECRET_KEY
    );
    //@ts-ignore
    const accessToken = jwt.sign(
      payload,
      process.env.ACCESS_TOKEN_SECRET_KEY as string,
      {
        expiresIn: process.env.ACCESS_TOKEN_EXPIRY as string,
      }
    );

    //@ts-ignore
    const refreshToken = jwt.sign(
      payload,
      process.env.REFRESH_TOKEN_SECRET_KEY as string,
      {
        expiresIn: process.env.REFRESH_TOKEN_EXPIRY as string,
      }
    );
    return { accessToken, refreshToken };
  } catch (error) {
    throw new Error(`can't generate tokens because of this error ${error}`);
  }
}
export const register = async (req: Request, res: Response) => {
  try {
    const name = req.body.name;
    const email = req.body.email;
    const password = req.body.password;

    console.log("name", name, "email", email, password, "password");

    if (!name || !email || !password) {
      console.log("required field are missing");
      res.status(404).json({ message: "required Fields are missing" });
    }

    console.log("we are here1");

    const hashPassword = await bcrypt.hash(password, 10);
    console.log("we are here2");

    const user = await client.user.create({
      data: {
        name: name,
        email: email,
        password: hashPassword,
        role: "USER",
        refreshToken: "",
      },
    });
    console.log("we are here3");

    if (!user) {
      res.status(400).json({ message: "user is not created" });
      return;
    }
    console.log("we are here4");

    res.status(200).json(user);
  } catch (error) {
    console.log("we are here5");

    console.log("internal server error", error);
    res.status(500).json({ message: `error in registering of user ${error}` });
  }
};

export const signIn = async (req: Request, res: Response) => {
  const email = req.body.email;
  const password = req.body.password;

  const existingUser = await client.user.findFirst({
    where: {
      email,
    },
  });

  if (!existingUser) {
    res.status(404).json({ message: "user not registered" });
    return;
  }
  let match = false;
  if (existingUser.role === "USER") {
    match = await bcrypt.compare(password, existingUser?.password);
  } else {
    if (existingUser.password === password) {
      match = true;
    }
  }

  if (!match) {
    res.status(400).json({ message: "password is incorrect" });
    return;
  }

  const { accessToken, refreshToken } = await generateAccessAndRefreshToken(
    existingUser.id
  );

  existingUser.refreshToken = refreshToken;

  const loggedInUser = await client.user.update({
    where: {
      id: existingUser.id,
    },
    data: {
      refreshToken: refreshToken,
    },
    select: {
      id: true,
      name: true,
      email: true,
      createdAt: true,
      role: true,
    },
  });

  res
    .status(200)
    .cookie("refreshToken", refreshToken)
    .cookie("accessToken", accessToken)
    .json({ loggedInUser, accessToken });
};

export const signOut = async (req: Request, res: Response) => {
  try {
    console.log("cookie", req.cookies);

    await client.user.updateMany({
      where: {
        refreshToken: req.cookies.refreshToken,
      },
      data: {
        refreshToken: "",
      },
    });

    res
      .status(200)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: "logged out the user" });
  } catch (error) {
    res
      .status(500)
      .clearCookie("accessToken", options)
      .clearCookie("refreshToken", options)
      .json({ message: ` internal server error in loggingout  ${error}` });
  }
};

export const updateUser = async (req: Request, res: Response) => {};

export const getProfile = async (req: Request, res: Response) => {};

export const getReadList = async (req: Request, res: Response) => {};

export const addToReadList = async (req: Request, res: Response) => {};

export const deleteFromReadList = async (req: Request, res: Response) => {};
