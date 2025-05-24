import { v2 as cloudinary } from "cloudinary";

import fs from "fs";

cloudinary.config({
  cloud_name: process.env.CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
});

export const uploadOnCloudinary = async (localFilePath: any) => {
  try {
    if (!localFilePath) return "";

    console.log("in cloudinary", localFilePath);
    const response = await cloudinary.uploader.upload(localFilePath.path, {
      resource_type: "auto",
    });
    console.log("success upload ", response.url);
    fs.unlinkSync(localFilePath.path);
    return response.url;
  } catch (err) {
    fs.unlinkSync(localFilePath.path);

    throw new Error();
  }
};
