import { Request, Response } from "express"
import UserService from "../Service/userService"

export default class UserController {
  public static async getUser(req: Request, res: Response) {
    const userEmail = req.query.email as string
    const user = await UserService.getUser(userEmail)
    res.send(user)
  }
}
