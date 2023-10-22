import { readFileSync } from "fs"
import { unlink } from "fs/promises"
import { Notes } from "../types"

export class NotesFilter {
    async handle() {
        const notes = readFileSync("notesTemp.json", { encoding: "utf-8" })
            .split("}")
            .map((each) => each + "}")

        notes.pop()

        const notesParsed: Notes[] = notes
            .map((each) => {
                return JSON.parse(each)
            })
            .map((each) => {
                return {
                    index: parseInt(each.index),
                    note: each.name.toString() as string
                }
            })
        const notesFiltered: Notes[] = []
        const filter = new Set([...notesParsed.map(({ index }) => index)])

        filter.forEach((number) => {
            notesFiltered.push(notesParsed.find(({ index }) => index == number))
        })

        await unlink("./notesTemp.json")

        return notesFiltered
    }
}
