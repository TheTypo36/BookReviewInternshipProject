import { Request, Response } from "express";
import client from "../db";

interface newreq extends Request {
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

export const getBook = async (req: Request, res: Response) => {};

export const addBook = async (req: Request, res: Response) => {};
