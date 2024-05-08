import PlaylistService from "@services/playlistService"
import type { Server, Socket } from "socket.io"

export class PlaylistSocketController {
  private io: Server
  private socket: Socket
  constructor(io: Server, socket: Socket) {
    this.io = io
    this.socket = socket

    this.socket.on("play", async (data) => {
      const songInfo = await this.play(data.roomId)
      this.io.to(data.roomId).emit("play", songInfo)
    })

    this.socket.on("pause", (data) => {
      this.io.to(data.roomId).emit("pause", data.durationInfo)
    })

    this.socket.on("next", async (data) => {
      const nextSong = await PlaylistService.playNextSong(Number(data.roomId))
      this.io.to(data.roomId).emit("next", nextSong)
    })

    this.socket.on("previous", async (data) => {
      const previousSong = await PlaylistService.playPreviousSong(
        Number(data.roomId)
      )
      this.io.to(data.roomId).emit("previous", previousSong)
    })

    // sync
    this.socket.on("sync", (data) => {
      this.io.to(data.roomId).emit("sync-ask", data.author_id)
    })
    this.socket.on("sync-send", (data) => {
      this.io.to(data.roomId).emit("sync-data", data)
    })

    this.socket.on("change-track-position", async (data) => {
      const changedSong = await PlaylistService.changeTrackPosition(
        Number(data.roomId),
        data.position,
        data.track_id
      )
      this.io.to(data.roomId).emit("change-track-position", changedSong)
    })

    this.socket.on("add-new-track", async (data) => {
      const newTrack = await this.addNewTrack(data.roomId, data.track)
      this.io.to(data.roomId).emit("add-new-track", newTrack)
    })
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
