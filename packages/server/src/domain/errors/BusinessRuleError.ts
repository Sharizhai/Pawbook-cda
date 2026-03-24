/**
 * business rules like can't like our own post, follow ourself...
 */
export class BusinessRuleError extends Error {
    readonly statusCode = 422;

    constructor(message: string) {
        super(message);
        this.name = "BusinessRuleError";
    }
}