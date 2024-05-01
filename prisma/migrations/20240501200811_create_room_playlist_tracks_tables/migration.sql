-- CreateEnum
CREATE TYPE "Role" AS ENUM ('USER', 'ADMIN');

-- AlterTable
ALTER TABLE "users" ADD COLUMN     "is_active" BOOLEAN NOT NULL DEFAULT true,
ADD COLUMN     "role" "Role" NOT NULL DEFAULT 'USER',
ADD COLUMN     "roomsId" BIGINT;

-- CreateTable
CREATE TABLE "rooms" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "name" VARCHAR NOT NULL,
    "author_id" BIGINT NOT NULL,

    CONSTRAINT "rooms_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "playList" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "room_id" BIGINT NOT NULL,
    "current" INTEGER NOT NULL DEFAULT 0,
    "is_playing" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "playList_pkey" PRIMARY KEY ("id")
);

-- CreateTable
CREATE TABLE "tracks" (
    "id" BIGSERIAL NOT NULL,
    "created_at" TIMESTAMPTZ(6) NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "playList_id" BIGINT NOT NULL,
    "title" TEXT NOT NULL,
    "added_by_id" BIGINT NOT NULL,
    "position" INTEGER NOT NULL DEFAULT 0,
    "url" TEXT NOT NULL,
    "playing" BOOLEAN NOT NULL DEFAULT false,

    CONSTRAINT "tracks_pkey" PRIMARY KEY ("id")
);

-- CreateIndex
CREATE UNIQUE INDEX "rooms_author_id_key" ON "rooms"("author_id");

-- CreateIndex
CREATE UNIQUE INDEX "playList_room_id_key" ON "playList"("room_id");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_playList_id_key" ON "tracks"("playList_id");

-- CreateIndex
CREATE UNIQUE INDEX "tracks_added_by_id_key" ON "tracks"("added_by_id");

-- AddForeignKey
ALTER TABLE "users" ADD CONSTRAINT "users_roomsId_fkey" FOREIGN KEY ("roomsId") REFERENCES "rooms"("id") ON DELETE SET NULL ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "rooms" ADD CONSTRAINT "rooms_author_id_fkey" FOREIGN KEY ("author_id") REFERENCES "users"("id") ON DELETE RESTRICT ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "playList" ADD CONSTRAINT "playList_room_id_fkey" FOREIGN KEY ("room_id") REFERENCES "rooms"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_playList_id_fkey" FOREIGN KEY ("playList_id") REFERENCES "playList"("id") ON DELETE CASCADE ON UPDATE CASCADE;

-- AddForeignKey
ALTER TABLE "tracks" ADD CONSTRAINT "tracks_added_by_id_fkey" FOREIGN KEY ("added_by_id") REFERENCES "users"("id") ON DELETE CASCADE ON UPDATE CASCADE;
