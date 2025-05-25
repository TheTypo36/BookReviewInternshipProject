import { Request, Response } from "express";
import client from "../db";
import { uploadOnCloudinary } from "../utils/cloudinary";
// import { newreq } from "../interfaces";
export interface newreq extends Request {
  user?: number;
  query: {
    page: string;
    limit: string;
  };
}
export const getAllBooks = async (req: newreq, res: Response) => {
  const page = parseInt(req.query.page);
  const limit = parseInt(req.query.limit);
  if (!page && !limit) {
    res.status(404).json({ message: "limit and page is required" });
    return;
  }
  const skip = (page - 1) * limit;
  try {
    const [books, totalBooks] = await client.$transaction([
      client.book.findMany({
        skip: skip,
        take: limit,
        orderBy: {
          createdAt: "desc",
        },
      }),
      client.book.count(),
    ]);

    const totalPage = Math.ceil(totalBooks / limit);

    res.status(200).json({
      data: books,
      pagination: {
        totalItems: totalBooks,
        itemsPerPage: limit,
        totalPage: totalPage,

        prevPage: page > 1 ? page - 1 : null,
        nextPage: page < totalBooks ? page + 1 : null,
      },
    });
  } catch (error) {
    console.log(`error in fetching booking with pagination ${error}`);
    res
      .status(500)
      .json({ message: `error in fetching booking with pagination ${error}` });
  }
};

export const getBook = async (req: Request, res: Response) => {
  const bookId = parseInt(req.params.id);

  if (!bookId) {
    res.status(400).json({ message: "bookId required" });
    return;
  }

  try {
    const book = await client.book.findFirst({
      where: {
        id: bookId,
      },
    });

    if (!book) {
      res.status(404).json({ message: `no book are found of id ${bookId}` });
      return;
    }

    res.status(200).json(book);
  } catch (error) {
    console.log(`interval server error ${error}`);
    res.status(500).json({ message: `interval server error ${error}` });
  }
};

export const addBook = async (req: Request, res: Response) => {
  const userId = req.user;

  if (req.admin == false) {
    console.log("this is user cannot add books");
    res.status(400).json({ message: "unauthorized request" });
    return;
  }
  const title = req.body.title;
  const country = req.body.country;
  const Language = req.body.Language;
  const Author = req.body.Author;
  const Year = req.body.Year;
  const page = parseInt(req.body.page);
  const Link = req.body.Link;
  const existingUser = await client.user.findFirst({
    where: {
      id: userId,
    },
  });

  const localFilePath = req.file;
  console.log(localFilePath);
  if (!localFilePath) {
    res.status(404).json({ message: "need coverImage for creation of book" });
    return;
  }
  if (!existingUser) {
    console.log("invalid user");
    return;
  }
  const coverImg = await uploadOnCloudinary(localFilePath);
  console.log("covverimg", coverImg);
  const book = await client.book.create({
    data: {
      title,
      country,
      coverImg,
      Language,
      Author,
      Year,
      page,
      Link,
      addedBy: existingUser?.id,
    },
  });
  if (!book) {
    res.status(400).json({ message: "book is not created" });
  }
  res.status(200).json(book);
};

export const removeBook = async (req: Request, res: Response) => {
  try {
    const bookId = parseInt(req.query?.bookId);

    if (!req.admin) {
      res
        .status(404)
        .json({ message: "authorized req: only admin can remove the book" });
      return;
    }

    await client.book.delete({
      where: {
        id: bookId,
      },
    });

    const stillExist = await client.book.findFirst({
      where: { id: bookId },
    });

    if (stillExist) {
      res.status(404).json({
        message: "error in deletion book is still there after deletion",
      });
      return;
    }

    res
      .status(200)
      .json({ message: "book is successfully remove from database" });
  } catch (error) {
    console.log(`internal server error in deletion of book ${error}`);
    res
      .status(500)
      .json({ message: `internal server error in deletion of book ${error}` });
  }
};
