import PlaylistService from "@services/playlistService"
import type { Server, Socket } from "socket.io"

export class PlaylistSocketController {
  private io: Server
  private socket: Socket
  constructor(io: Server, socket: Socket) {
    this.io = io
    this.socket = socket

    // TODO: add socket listeners
    // ?1 play
    this.socket.on("play", async (data) => {
      const songInfo = await this.play(data.roomId)
      this.io.to(data.roomId).emit("play", songInfo)
    })

    // ?2 pause
    this.socket.on("pause", (data) => {
      this.io.to(data.roomId).emit("pause", data.durationInfo)
    })

    // ?3 next
    this.socket.on("next", async (data) => {
      const nextSong = await PlaylistService.playNextSong(Number(data.roomId))
      this.io.to(data.roomId).emit("next", nextSong)
    })

    // ?4 previous
    this.socket.on("previous", async (data) => {
      const previousSong = await PlaylistService.playPreviousSong(
        Number(data.roomId)
      )
      this.io.to(data.roomId).emit("previous", previousSong)
    })

    // ?5 sync
  }

  public async play(roomId: string) {
    const song = await PlaylistService.nowPLaying(Number(roomId))
    if (!song) {
      return null
    }

    return song
  }

  public async addNewTrack(roomId: string, track: any) {
    const newTrack = await PlaylistService.addNewTrack(Number(roomId), track)
    return newTrack
  }
}
