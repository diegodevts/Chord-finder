export class HttpError {
    public message: string
    public statusCode: number

    constructor({ message, statusCode }) {
        this.message = message
        this.statusCode = statusCode
    }
}
