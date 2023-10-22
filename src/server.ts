import express, { Request, Response } from "express"
import cors from "cors"
import path from "path"
import routes from "./routes"

const app = express()
const port = 3876

app.use(cors())
app.use(express.json())
app.use("/src", express.static(__dirname))
app.use(express.urlencoded({ extended: false }))

app.use(routes)
app.get("/", (req, res) => {
    return res.sendFile(path.resolve("index.html"))
})

app.listen(port, async () => {
    console.log("Server running on port: " + port)
})
