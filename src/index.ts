import Express from "express"
import { createServer } from "http"
import { Server } from "socket.io"
import UserController from "@controllers/userController"
import AudioController from "@controllers/audioController"
import {
  RoomController,
  RoomSocketController,
} from "@controllers/roomsController"
import { PlaylistSocketController } from "@controllers/playlistController"
import { jwtVerify } from "@kinde-oss/kinde-node-express"
import cors from "cors"

const JWT_verify = jwtVerify("https://melomix.kinde.com", {
  audience: "",
})

export const app = Express()
const port = process.env.PORT || 4000
const server = createServer(app)

app.use(
  cors({
    origin: "*",
    methods: ["GET", "POST", "DELETE", "PUT"],
    allowedHeaders: ["Content-Type", "Authorization"],
    credentials: true,
  })
)

const io = new Server(server, {
  cors: {
    origin: "*",
  },
})

app.use(Express.json())

io.on("connection", (socket) => {
  new RoomSocketController(io, socket)
  new PlaylistSocketController(io, socket)
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

// Room routes
app.get("/get-room", RoomController.getRoom)
app.get("/get-rooms", RoomController.getRooms)
app.post("/create-room", RoomController.createRoom)
app.delete("/delete-room", RoomController.deleteRoom)

server.listen(port, () => {
  console.log(`Server listening at http://localhost:${port}`)
})
