import { Request, Response } from "express"

export default class UserController {
  public static async getUser(req: Request, res: Response) {
    res.send("Get User")
  }
}
