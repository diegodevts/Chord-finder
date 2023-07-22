import { Router } from "express"
import chordSolver from "./chord-solver/routes"

const routes = Router()

routes.use("/chord", chordSolver)

export default routes
