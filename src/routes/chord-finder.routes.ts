import { Request, Response, Router } from "express"
import { chordFinderController } from "../controllers"

const endpoint = Router()

endpoint.post("/notes/hertz", async (req: Request, res: Response) => {
    return await chordFinderController.execute(req, res)
})

export default endpoint
