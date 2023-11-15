import { Router } from "express"
import chordSolver from "./routes/chord-finder.routes"
import scaleSolver from "./routes/scale-finder.routes"
const routes = Router()

routes.use("/", chordSolver)
routes.use("/", scaleSolver)

export default routes
