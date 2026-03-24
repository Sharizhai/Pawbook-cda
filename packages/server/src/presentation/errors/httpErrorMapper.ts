import {UnauthorizedError} from "$domain/errors/UnauthorizedError";
import {BusinessRuleError} from "$domain/errors/BusinessRuleError";
import {ValidationError} from "$domain/errors/ValidationError";
import {ForbiddenError} from "$domain/errors/ForbiddenError";
import {NotFoundError} from "$domain/errors/NotFoundError";
import {ConflictError} from "$domain/errors/ConflictError";

export function getHttpStatus(error: unknown): number {
    if (error instanceof ValidationError)    return 400;
    if (error instanceof UnauthorizedError)  return 401;
    if (error instanceof ForbiddenError)     return 403;
    if (error instanceof NotFoundError)      return 404;
    if (error instanceof ConflictError)      return 409;
    if (error instanceof BusinessRuleError)  return 422;

    return 500;
}