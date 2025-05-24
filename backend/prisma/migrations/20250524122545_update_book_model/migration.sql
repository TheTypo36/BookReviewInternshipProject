/*
  Warnings:

  - You are about to drop the column `description` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `name` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `release_date` on the `Book` table. All the data in the column will be lost.
  - You are about to drop the column `sale` on the `Book` table. All the data in the column will be lost.
  - Added the required column `Language` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Link` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `Year` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `country` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `page` to the `Book` table without a default value. This is not possible if the table is not empty.
  - Added the required column `title` to the `Book` table without a default value. This is not possible if the table is not empty.

*/
-- AlterTable
ALTER TABLE "Book" DROP COLUMN "description",
DROP COLUMN "name",
DROP COLUMN "release_date",
DROP COLUMN "sale",
ADD COLUMN     "Language" TEXT NOT NULL,
ADD COLUMN     "Link" TEXT NOT NULL,
ADD COLUMN     "Year" TEXT NOT NULL,
ADD COLUMN     "country" TEXT NOT NULL,
ADD COLUMN     "page" INTEGER NOT NULL,
ADD COLUMN     "title" TEXT NOT NULL;
