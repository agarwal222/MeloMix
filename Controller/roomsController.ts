import { Request, Response } from "express"
import RoomsService from "../Service/roomService"

export default class RoomController {
  public static async getRoom(req: Request, res: Response) {
    const id = req.params.id
    const room = await RoomsService.getRoom(Number(id))
    res
      .json({
        message: "Success",
        payload: room,
      })
      .status(200)
  }

  public static async getRooms(req: Request, res: Response) {
    const rooms = await RoomsService.getRooms()
    res
      .json({
        message: "Success",
        payload: rooms,
      })
      .status(200)
  }

  public static async createRoom(req: Request, res: Response) {
    const name: string = req.body.name
    const author_id = req.body.author_id
    const room = await RoomsService.createRoom(name, Number(author_id))
    res
      .json({
        message: "Success",
        payload: room,
      })
      .status(201)
  }

  public static async deleteRoom(req: Request, res: Response) {
    const id = req.params.id
    const room = await RoomsService.deleteRoom(Number(id))
    res
      .json({
        message: "Success",
        payload: room,
      })
      .status(200)
  }
}
