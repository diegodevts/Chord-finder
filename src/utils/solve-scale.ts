import { intervals } from "../config/intervals"
import { notes } from "../config/notes"
import { notes_index } from "../config/notes-index"
import { scales, testScales } from "../config/scales"
import { ChordType } from "../utils/chord-type"

export class ScaleSolver {
    constructor() {}

    async handle(chordNotes: string[], mostRepeated: any[]) {
        const fundamentalsFiltered = mostRepeated
        const asserts = []
        for (let { note } of fundamentalsFiltered) {
            const fundamentalNoteIndex = notes.indexOf(note)

            const chromaticScale = [
                ...notes.slice(fundamentalNoteIndex, notes.length),
                ...notes.slice(0, fundamentalNoteIndex)
            ]

            const chordIntervalNumbers = [
                ...new Set([
                    ...chromaticScale.flatMap((note) =>
                        chordNotes.filter((each) => each == note)
                    )
                ])
            ]
            const scaleIntervals = chordIntervalNumbers.map((note) =>
                chromaticScale.indexOf(note)
            )

            asserts.push(await testScales(scaleIntervals, note))
        }

        console.log(mostRepeated)
        return asserts.find(
            (assert) =>
                Math.max(...asserts.map((each) => each.acumulator)) ==
                assert.acumulator
        )
    }
}
