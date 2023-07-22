import { intervals } from "../config/intervals"
import { notes } from "../config/notes"
import { ChordType } from "../utils/chord-type"

export class ChordSolver {
    constructor(private chordType: ChordType) {}

    async handle(chordNotes: string[]) {
        const fundamental = chordNotes[0]
        const fundamentalNoteIndex = notes.indexOf(fundamental)

        const chromaticScale = [
            ...notes.slice(fundamentalNoteIndex, notes.length),
            ...notes.slice(0, fundamentalNoteIndex)
        ]

        const chordIntervalNumbers = [
            ...chordNotes.map((note) => chromaticScale.indexOf(note))
        ]

        const isChordNatural = await this.chordType.isNatural(
            chordNotes,
            chordIntervalNumbers
        )

        if (isChordNatural) {
            return isChordNatural
        }

        const chordIntervals: (
            | {
                  name: string
                  seventh: string
                  value: number
                  seventh_value: number
              }
            | {
                  name: string
                  seventh?: undefined
                  value: number
                  seventh_value?: undefined
              }
        )[] = []

        for (let { value, seventh, name, seventh_value } of intervals) {
            if (chordIntervalNumbers.includes(value)) {
                if (name !== "1" && name !== "3M" && name !== "5") {
                    chordIntervals.push({
                        name: seventh ?? name,
                        value: seventh_value ?? value
                    })
                }
            }
        }

        const sortIntervals = chordIntervals.sort((a, b) => a.value - b.value)

        const chord =
            fundamental +
            sortIntervals
                .map(({ name, seventh }) => `(${seventh ?? name})`)
                .join("")

        return chord
    }
}
