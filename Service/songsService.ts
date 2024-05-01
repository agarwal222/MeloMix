import Ytdl from "ytdl-core"
import YTMusic from "ytmusic-api"

class SongsService {
  // initialize ytmusic once for whole class
  private static ytm = new YTMusic()
  public static async getAudioStream(url: string) {
    if (!Ytdl.validateURL(url)) {
      throw new Error("Invalid URL")
    }

    const info = await Ytdl.getInfo(url)
    const audioFormat = Ytdl.filterFormats(info.formats, "audioonly")
    if (audioFormat.length === 0) {
      throw new Error("No audio formats found")
    }

    const stream = Ytdl(url, {
      filter: "audioonly",
      format: audioFormat[0],
    })

    return stream
  }

  public static async getAudioURL(id: string) {
    if (!Ytdl.validateID(id)) {
      throw new Error("Invalid ID")
    }
    const url = Ytdl.getURLVideoID(id)
    const info = await Ytdl.getInfo(url)
    const audioFormat = Ytdl.filterFormats(info.formats, "audioonly")
    if (audioFormat.length === 0) {
      throw new Error("No audio formats found")
    }

    return audioFormat[0].url
  }

  public static async getAudioInfo(id: string) {
    await this.ytm.initialize()
    const thumbnail = (await this.ytm.getVideo(id)).thumbnails
    const lyrics = await this.ytm.getLyrics(id)
    const title = (await this.ytm.getVideo(id)).name

    return { thumbnail, lyrics, title }
  }
}

export default SongsService
