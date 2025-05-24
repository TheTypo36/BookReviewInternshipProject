/*
  Warnings:

  - A unique constraint covering the columns `[userId,bookId]` on the table `ReadList` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `refreshToken` to the `User` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "User" ADD COLUMN     "refreshToken" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "ReadList_userId_bookId_key" ON "ReadList"("userId", "bookId");
