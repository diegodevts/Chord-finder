import { Request, Response, Router } from "express"
import { scaleFinderController } from "../controllers/scale/index"

const endpoint = Router()

endpoint.post("/find/scale", async (req: Request, res: Response) => {
    return await scaleFinderController.execute(req, res)
})

export default endpoint
