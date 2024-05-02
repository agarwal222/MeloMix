import { Request, Response } from "express"
import RoomsService from "../Service/roomService"
import type { Server, Socket } from "socket.io"

export class RoomController {
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

export class RoomSocketController {
  private io: Server
  private socket: Socket
  constructor(io: Server, socket: Socket) {
    this.io = io
    this.socket = socket

    this.socket.on("joinRoom", (data) => {
      this.joinRoom(data.roomId, data.userId)
    })
    this.socket.on("leaveRoom", (data) => {
      this.leaveRoom(data.roomId, data.userId)
    })
  }

  public async joinRoom(roomId: string, userId: number) {
    this.socket.join(roomId)
    this.socket.emit("userJoined", { userId })
    this.socket.on("disconnect", () => {
      this.socket.leave(roomId)
    })
  }

  public async leaveRoom(roomId: string, userId: number) {
    this.socket.leave(roomId)
    this.socket.emit("userLeft", { userId })
  }
}
