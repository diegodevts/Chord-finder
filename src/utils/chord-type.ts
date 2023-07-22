interface IChordType {}

export class ChordType {
    async isNatural(notes: string[], chordIntervalNumbers: number[]) {
        if (notes.length != 3) {
            return false
        }
        const sortedChordIntervalNumbers = chordIntervalNumbers.sort()

        if (sortedChordIntervalNumbers.toString() == "0,4,7") {
            return notes[0]
        }

        if (sortedChordIntervalNumbers.toString() == "0,3,7") {
            return notes[0] + "m"
        }
    }
}
