import { Request, Response } from "express"
import { ChordFinder } from "../services/chord-finder"

export class ChordFinderController {
    constructor(private chordFinder: ChordFinder) {}

    async execute(req: Request, res: Response) {
        try {
            const { chord } = await this.chordFinder.handle(req.body)
            res.status(200).send({ chord })
        } catch (error) {
            return res.status(500).json(error.message)
        }
    }
}
