import Express from "express"
import Ytdl from "ytdl-core"

const app = Express()
const port = process.env.PORT || 4000

app.get("/", (req, res) => {
  res.send("Welcome to MeloMix Backend!")
})

app.get("/get-audio", async (req, res) => {
  const url = req.query.url as string

  if (!Ytdl.validateURL(url)) {
    res.status(400).send("Invalid URL")
    return
  }

  const info = await Ytdl.getInfo(url)
  const audioFormat = Ytdl.filterFormats(info.formats, "audioonly")
  if (audioFormat.length === 0) {
    res.status(400).send("No audio formats found")
    return
  }

  const stream = Ytdl(url, {
    filter: "audioonly",
    format: audioFormat[0],
  })

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
    console.log("Stream ended")
    res.end()
  })
})

app.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
