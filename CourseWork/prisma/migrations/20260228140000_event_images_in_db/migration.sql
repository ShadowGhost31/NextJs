CREATE TABLE "EventImage" (
  "id" TEXT NOT NULL,
  "eventId" TEXT NOT NULL,
  "mime" TEXT NOT NULL,
  "data" BYTEA NOT NULL,
  "createdAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  "updatedAt" TIMESTAMP(3) NOT NULL DEFAULT CURRENT_TIMESTAMP,
  CONSTRAINT "EventImage_pkey" PRIMARY KEY ("id")
);

CREATE UNIQUE INDEX "EventImage_eventId_key" ON "EventImage"("eventId");
CREATE INDEX "EventImage_eventId_idx" ON "EventImage"("eventId");

ALTER TABLE "EventImage" ADD CONSTRAINT "EventImage_eventId_fkey" FOREIGN KEY ("eventId") REFERENCES "Event"("id") ON DELETE CASCADE ON UPDATE CASCADE;

ALTER TABLE "Event" DROP COLUMN "imageUrl";
