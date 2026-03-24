/**
 * don't have permission to do this action'
 */
export class ForbiddenError extends Error {
    readonly statusCode = 403;

    constructor(message: string) {
        super(message);
        this.name = "ForbiddenError";
    }
}