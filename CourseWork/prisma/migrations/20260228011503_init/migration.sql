/*
  Warnings:

  - You are about to drop the column `updatedAt` on the `Event` table. All the data in the column will be lost.
  - You are about to drop the column `createdAt` on the `OrderItem` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `Review` table. All the data in the column will be lost.
  - You are about to drop the column `updatedAt` on the `User` table. All the data in the column will be lost.
  - You are about to drop the `OrganizerProfile` table. If the table is not empty, all the data it contains will be lost.
  - A unique constraint covering the columns `[slug]` on the table `Category` will be added. If there are existing duplicate values, this will fail.
  - Added the required column `slug` to the `Category` table without a default value. This is not possible if the table is not empty.

*/
-- DropForeignKey
ALTER TABLE "OrganizerProfile" DROP CONSTRAINT "OrganizerProfile_userId_fkey";

-- DropIndex
DROP INDEX "Category_title_key";

-- DropIndex
DROP INDEX "Event_categoryId_idx";

-- DropIndex
DROP INDEX "Event_organizerId_idx";

-- DropIndex
DROP INDEX "Event_venueId_idx";

-- DropIndex
DROP INDEX "Favorite_userId_idx";

-- DropIndex
DROP INDEX "Order_status_idx";

-- DropIndex
DROP INDEX "Order_userId_idx";

-- DropIndex
DROP INDEX "Review_eventId_idx";

-- DropIndex
DROP INDEX "Review_status_idx";

-- DropIndex
DROP INDEX "Venue_title_key";

-- AlterTable
ALTER TABLE "Category" ADD COLUMN     "slug" TEXT NOT NULL;

-- AlterTable
ALTER TABLE "Event" DROP COLUMN "updatedAt",
ADD COLUMN     "publishedAt" TIMESTAMP(3);

-- AlterTable
ALTER TABLE "Order" ALTER COLUMN "total" SET DEFAULT 0;

-- AlterTable
ALTER TABLE "OrderItem" DROP COLUMN "createdAt";

-- AlterTable
ALTER TABLE "Review" DROP COLUMN "updatedAt",
ADD COLUMN     "moderatedAt" TIMESTAMP(3),
ADD COLUMN     "moderatedById" TEXT;

-- AlterTable
ALTER TABLE "User" DROP COLUMN "updatedAt";

-- DropTable
DROP TABLE "OrganizerProfile";

-- CreateIndex
CREATE UNIQUE INDEX "Category_slug_key" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Category_slug_idx" ON "Category"("slug");

-- CreateIndex
CREATE INDEX "Event_status_startAt_idx" ON "Event"("status", "startAt");

-- CreateIndex
CREATE INDEX "Event_categoryId_startAt_idx" ON "Event"("categoryId", "startAt");

-- CreateIndex
CREATE INDEX "Event_venueId_startAt_idx" ON "Event"("venueId", "startAt");

-- CreateIndex
CREATE INDEX "Favorite_userId_createdAt_idx" ON "Favorite"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Order_userId_createdAt_idx" ON "Order"("userId", "createdAt");

-- CreateIndex
CREATE INDEX "Review_status_createdAt_idx" ON "Review"("status", "createdAt");

-- CreateIndex
CREATE INDEX "Venue_city_idx" ON "Venue"("city");

-- AddForeignKey
ALTER TABLE "Review" ADD CONSTRAINT "Review_moderatedById_fkey" FOREIGN KEY ("moderatedById") REFERENCES "User"("id") ON DELETE SET NULL ON UPDATE CASCADE;
