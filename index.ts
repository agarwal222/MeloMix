import Express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import UserController from "./Controller/userController"
import AudioController from "./Controller/audioController"

export const app = Express()
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

// User routes
app.get("/get-user", UserController.getUser)
app.post("/create-user", UserController.createUser)

// Song routes
app.get("/get-audio", AudioController.getAudioStream)
app.get("/get-audio-url", AudioController.getAudioURL)
app.get("/get-audio-info", AudioController.getAudioInfo)

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
