/*
  Warnings:

  - A unique constraint covering the columns `[title,city]` on the table `Venue` will be added. If there are existing duplicate values, this will fail.

*/
-- CreateIndex
CREATE UNIQUE INDEX "Venue_title_city_key" ON "Venue"("title", "city");
