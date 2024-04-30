import { default as db } from "../lib/prismaClint"

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

    if (!user) {
      throw new Error("User not found")
    }

    return user
  }
}
