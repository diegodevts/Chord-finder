import { ChordType } from "../utils/chord-type"
import { NotesFilter } from "../utils/notes-filter"
import { ChordSolver } from "../utils/solve-chord"
import { ChordFinder } from "../services/chord-finder"
import { ChordFinderController } from "./chord-finder"

const notesFilter = new NotesFilter()
const chordType = new ChordType()
const chordSolver = new ChordSolver(chordType)

const chordFinder = new ChordFinder(notesFilter, chordSolver)
const chordFinderController = new ChordFinderController(chordFinder)

export { chordFinderController }
