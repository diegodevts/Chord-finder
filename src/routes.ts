import { Router } from "express"
import chordSolver from "./routes/chord-finder.routes"

const routes = Router()

routes.use("/", chordSolver)

export default routes
