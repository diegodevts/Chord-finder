import { notes_index } from "../config/notes-index"
import { createWriteStream } from "fs"
import { Writable, Transform, Readable, pipeline } from "stream"
import { promisify } from "util"
import { NotesFilter } from "../utils/notes-filter"
import { ChordSolver } from "../utils/solve-chord"
import { ChordType } from "../utils/chord-type"
import { Notes } from "../types"

export class ChordFinder {
    constructor(
        private notesFilter: NotesFilter,
        private chordSolver: ChordSolver
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
            const notesFromDB = (await this.notesFilter.handle()) as Notes[]

            const getChord = await this.chordSolver.handle(
                notesFromDB.map(({ note }) => note)
            )

            return { chord: getChord }
        }
    }
}
