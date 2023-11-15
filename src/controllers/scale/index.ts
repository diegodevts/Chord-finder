import { NotesFilter } from "../../utils/notes-filter"
import { ScaleSolver } from "../../utils/solve-scale"
import { ScaleFinder } from "../../services/scale-finder"
import { ScaleFinderController } from "./scale-finder"

const notesFilter = new NotesFilter()
const scaleSolver = new ScaleSolver()

const scaleFinder = new ScaleFinder(notesFilter, scaleSolver)
const scaleFinderController = new ScaleFinderController(scaleFinder)

export { scaleFinderController }
