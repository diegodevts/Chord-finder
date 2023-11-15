import { Request, Response } from "express"
import { ScaleFinder } from "../../services/scale-finder"

export class ScaleFinderController {
    constructor(private scaleFinder: ScaleFinder) {}

    async execute(req: Request, res: Response) {
        try {
            const chord = await this.scaleFinder.handle(req.body)
            res.status(200).send(chord)
        } catch (error) {
            console.log(error)
            return res.status(500).json(error.message)
        }
    }
}
