import express, { Request, Response } from "express"
import cors from "cors"
import { notes_index } from "./config/notes-index"
import path from "path"
import { notes } from "./config/notes"
import { createWriteStream } from "fs"
import { Writable, Transform, Readable, pipeline } from "stream"
import { promisify } from "util"
import { Notes } from "@prisma/client"
import { NotesFilter } from "./utils/notes-filter"
import { ChordSolver } from "./utils/solve-chord"
import { ChordType } from "./utils/chord-type"

const app = express()
const port = 3876

app.use(cors())
app.use(express.json())
app.use("/src", express.static(__dirname))
app.use(express.urlencoded({ extended: false }))
const notesFilter = new NotesFilter()
const chordType = new ChordType()
const chordSolver = new ChordSolver(chordType)

app.get("/", (req, res) => {
    return res.sendFile(path.resolve("index.html"))
})
app.post("/notes/hertz", async (req: Request, res) => {
    const notesFromBody = Object.keys(req.body).toString()
    const pipelineAsync = promisify(pipeline)
    const { index } = JSON.parse(notesFromBody)

    const newIndex = parseInt(index)

    for (let note in notes_index) {
        if (
            newIndex == notes_index[note] ||
            (newIndex - notes_index[note]) % 12 == 0
        ) {
            let notes = notes_index[note].toString()

            const readableStream = new Readable({
                read: function () {
                    this.push(
                        JSON.stringify({
                            index: notes,
                            name: note
                        })
                    )
                    this.push(null)
                }
            })

            const editStream = new Transform({
                transform(chunk, encoding, cb) {
                    let data = chunk

                    cb(null, data)
                }
            })

            await pipelineAsync(
                readableStream,
                editStream,
                createWriteStream("notesTemp.json", { flags: "a" })
            )
        }
    }

    if (index === "fim") {
        const notesFromDB = (await notesFilter.handle()) as Notes[]

        const getChord = await chordSolver.handle(
            notesFromDB.map(({ note }) => note)
        )

        return res.status(200).send({ chord: getChord })
    }
})

app.listen(port, async () => {
    console.log("Server running on port: " + port)
})
