import { default as db } from "@lib/prismaClint"
export default class RoomService {
  public static async getRoom(id: number) {
    const room = await db.rooms.findUnique({
      where: {
        id,
      },
    })
    return room
  }

  public static async getRooms() {
    const rooms = await db.rooms.findMany()
    return rooms
  }

  public static async createRoom(name: string, author_id: number) {
    const newRoom = await db.rooms.create({
      data: {
        name,
        author_id,
        playList: {
          create: {},
        },
      },
      include: {
        playList: true,
      },
    })
    return newRoom
  }

  public static async deleteRoom(id: number) {
    const room = await db.rooms.delete({
      where: {
        id,
      },
    })
    return room
  }
}
