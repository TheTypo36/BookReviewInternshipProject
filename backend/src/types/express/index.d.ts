import "express";
declare module "express" {
  export interface Request {
    file?: Express.Multer.File;

    user?: number;
    admin?: boolean;
    cookies?: {
      [key: string]: string;
    };
    query?: {
      page?: string;
      limit?: string;
      bookId?: Int;
      userId?: Int;
    };
  }

  export interface JwtPayload {
    _id: number;
    name: string;
    email: string;
  }
}
