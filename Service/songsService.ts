import Ytdl from "ytdl-core"

class SongsService {
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

  public static async getAudioURL(url: string) {
    if (!Ytdl.validateURL(url)) {
      throw new Error("Invalid URL")
    }

    const info = await Ytdl.getInfo(url)
    const audioFormat = Ytdl.filterFormats(info.formats, "audioonly")
    if (audioFormat.length === 0) {
      throw new Error("No audio formats found")
    }

    return audioFormat[0].url
  }

  public static async getAudioInfo(url: string) {
    if (!Ytdl.validateURL(url)) {
      throw new Error("Invalid URL")
    }

    const info = await Ytdl.getInfo(url)
    return info
  }
}

export default SongsService
