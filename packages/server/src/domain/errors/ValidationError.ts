/**
 * unrespected business rule like description too long
 */
export class ValidationError extends Error {
    readonly statusCode = 400;

    constructor(message: string) {
        super(message);
        this.name = "ValidationError";
    }
}