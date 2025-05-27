import { Request, Response } from "express";
import client from "../db";

export const getReview = async (req: Request, res: Response) => {
  const bookId = parseInt(req.query?.bookId);

  if (!bookId) {
    res
      .status(404)
      .json({ message: "bookid required for fetching the reviews" });
    return;
  }

  const book = await client.book.findFirst({
    where: {
      id: bookId,
    },
    include: {
      reviews: {
        include: {
          user: true,
        },
      },
    },
  });

  if (!book) {
    res.status(404).json({ message: "book is not in the database" });
  }
  res.status(200).json(book);
};

export const submitReview = async (req: Request, res: Response) => {
  try {
    const userId = req.user;

    const existingUser = await client.user.findFirst({
      where: {
        id: userId,
      },
    });

    if (!existingUser) {
      res.status(200).json({ message: "user not found" });
      return;
    }

    const content = req.body.content;
    const rating = parseInt(req.body.rating);
    const bookId = parseInt(req.query?.bookId);

    if (!content || !rating || !bookId) {
      res.status(400).json({ message: "missing content or rating or bookid" });
      return;
    }
    const review = await client.review.create({
      data: {
        content,
        rating,
        bookId,
        userId: existingUser.id,
      },
    });

    if (!review) {
      res.status(400).json({ message: "review is not creating" });
    }

    res.status(200).json({
      message: `review created by user ${userId} of book ${bookId}`,
    });
  } catch (error) {
    console.log(error);
    res.status(500).json({ message: `internal server error ${error}` });
  }
};
