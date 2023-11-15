import { readFileSync } from "fs"
import { unlink } from "fs/promises"
import { Notes } from "../types"

export class NotesFilter {
    //ver amanha
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
        const repeatedIndexCount: {
            acumulator: number
            index: number
            note: string
        }[] = []

        const sortedNotesParsed = notesParsed.map(({ index }) => index).sort()

        for (var i = 0; i < sortedNotesParsed.length; i++) {
            let acumulator = 0
            for (let j = sortedNotesParsed.length - 1; j >= 0; j--) {
                if (
                    j != i &&
                    sortedNotesParsed[i] == sortedNotesParsed[j + 1]
                ) {
                    acumulator += 1
                    sortedNotesParsed.splice(j + 1, 1)
                }

                // repeatedIndexCount.push({
                //     index: sortedNotesParsed[i],
                //     count: i + 1
                // })
            }

            repeatedIndexCount.push({
                acumulator,
                index: sortedNotesParsed[i],
                note: notesParsed.find(
                    ({ index }) => index == sortedNotesParsed[i]
                )?.note
            })
        }

        repeatedIndexCount.pop()

        // const filterNoises = repeatedIndexCount.filter(
        //     (each) => each.acumulator > 1
        // )

        // console.log(repeatedIndexCount)
        const mostRepeateds = repeatedIndexCount
            .sort((a, b) => b.acumulator - a.acumulator)
            .slice(0, 2)

        const filter = notesParsed.flatMap(({ index }) =>
            repeatedIndexCount.filter((each) => each.index == index)
        )

        filter.forEach((number) => {
            notesFiltered.push(
                notesParsed.find(({ index }) => index == number.index)
            )
        })

        await unlink("./notesTemp.json")

        return { notesFiltered, mostRepeateds }
    }
}
