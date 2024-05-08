import { Request, Response } from "express"
import SongsService from "@services/songsService"

export default class AudioController {
  public static async getAudioStream(req: Request, res: Response) {
    const url = req.query.url as string

    const stream = await SongsService.getAudioStream(url)

    stream.on("response", (resp) => {
      res.set(resp.headers)
    })

    stream.on("data", (chunk) => {
      res.write(chunk)
    })

    stream.on("error", (error) => {
      console.error(error)
      res.status(500).send(error)
    })

    stream.on("end", () => {
      res.end()
    })
  }

  public static async getAudioURL(req: Request, res: Response) {
    const songId = req.query.id as string
    const audioURL = await SongsService.getAudioURL(songId)
    res
      .json({
        message: "Success",
        payload: audioURL,
      })
      .status(200)
  }

  public static async getAudioInfo(req: Request, res: Response) {
    const songId = req.query.id as string
    const audioInfo = await SongsService.getAudioInfo(songId)

    res
      .json({
        message: "Success",
        payload: audioInfo,
      })
      .status(200)
  }
}
