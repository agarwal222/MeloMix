import { Request, Response } from "express"
import UserService from "../Service/userService"
import type { users } from "@prisma/client"

export default class UserController {
  public static async getUser(req: Request, res: Response) {
    const userEmail = req.query.email as string
    const user = await UserService.getUser(userEmail)
    if (!user) {
      res
        .json({
          message: "User not found",
        })
        .status(404)
      return
    }
    res
      .json({
        message: "Success",
        payload: user,
      })
      .status(200)
  }

  public static async createUser(req: Request, res: Response) {
    const userInfo: users = req.body
    const user = await UserService.createUser(userInfo)
    if (!user) {
      res
        .json({
          message: "User not created",
        })
        .status(404)
      return
    }
    res
      .json({
        message: "Success",
        payload: user,
      })
      .status(201)
  }
}
