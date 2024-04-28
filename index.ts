import Express from "express"
import { createServer } from "http"
import SongsService from "./Service/songsService"
import { Server } from "socket.io"
import UserController from "./Controller/userController"

const app = Express()
const port = process.env.PORT || 4000
const server = createServer(app)
const io = new Server(server, {
  cors: {
    origin: "*",
  },
})

app.use(Express.json())

io.on("connection", (socket) => {
  console.log("a user connected")
  socket.on("disconnect", () => {
    console.log("user disconnected")
  })
})

app.get("/", (req, res) => {
  res.send("Welcome to MeloMix Backend!")
})

app.get("/get-user", UserController.getUser)

app.get("/get-audio", async (req, res) => {
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
})

app.get("/get-audio-url", async (req, res) => {
  const url = req.query.url as string
  const audioURL = await SongsService.getAudioURL(url)
  res.send(audioURL)
})

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
