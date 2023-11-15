import { notes_index } from "../config/notes-index"
import { createWriteStream } from "fs"
import { Writable, Transform, Readable, pipeline } from "stream"
import { promisify } from "util"
import { NotesFilter } from "../utils/notes-filter"
import { Notes } from "../types"
import { ScaleSolver } from "../utils/solve-scale"

export class ScaleFinder {
    constructor(
        private notesFilter: NotesFilter,
        private scaleSolver: ScaleSolver
    ) {}

    async handle(notes: any) {
        const notesFromBody = Object.keys(notes).toString()
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
                    createWriteStream("./notesTemp.json", { flags: "a" })
                )
            }
        }

        if (index === "fim") {
            const { notesFiltered, mostRepeateds } =
                await this.notesFilter.handle()

            const getChord = await this.scaleSolver.handle(
                notesFiltered.map(({ note }) => note),
                mostRepeateds
            )

            return getChord
        }
    }
}
