/*
  Warnings:

  - A unique constraint covering the columns `[unique_id]` on the table `rooms` will be added. If there are existing duplicate values, this will fail.
  - The required column `unique_id` was added to the `rooms` table with a prisma-level default value. This is not possible if the table is not empty. Please add this column as optional, then populate it before making it required.

*/
-- AlterTable
ALTER TABLE "rooms" ADD COLUMN     "unique_id" TEXT NOT NULL;

-- CreateIndex
CREATE UNIQUE INDEX "rooms_unique_id_key" ON "rooms"("unique_id");
