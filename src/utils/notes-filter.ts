import { readFileSync, rm } from "fs"

export class NotesFilter {
    async handle() {
        const notes = readFileSync("notesTemp.json", { encoding: "utf-8" })
            .split("}")
            .map((each) => each + "}")

        notes.pop()

        const notesParsed = notes
            .map((each) => {
                return JSON.parse(each)
            })
            .map((each) => {
                return {
                    index: parseInt(each.index),
                    note: each.name.toString() as string
                }
            })
        const notesFiltered = []
        const filter = new Set([...notesParsed.map(({ index }) => index)])

        filter.forEach((number) => {
            notesFiltered.push(notesParsed.find(({ index }) => index == number))
        })

        rm(
            "C:\\Users\\Diego\\Desktop\\Chordometry\\notesTemp.json",
            { recursive: true },
            (err) => console.error(err)
        )

        return notesFiltered
    }
}
