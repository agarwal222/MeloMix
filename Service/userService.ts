import { default as db } from "../lib/prismaClint"
import type { users } from "@prisma/client"

export default class UserService {
  public static async getUser(email: string) {
    const user = await db.users.findUnique({
      where: {
        email,
      },
      select: {
        id: true,
        username: true,
        email: true,
        avatar: true,
        bio: true,
      },
    })
    return user
  }

  public static async createUser(userInfo: users) {
    const user = await db.users.create({
      data: userInfo,
    })
    return user
  }

  public static async updateUser(userInfo: users) {
    const user = await db.users.update({
      where: {
        id: userInfo.id,
      },
      data: userInfo,
    })
    return user
  }

  public static async deleteUser(email: string) {
    const user = await db.users.delete({
      where: {
        email,
      },
    })
    return user
  }
}
