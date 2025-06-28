import { attempt } from '@ryact-utils/attempt';

export class ApiError extends Error {
	status = 500;
}

export class InternalServerError extends ApiError {
	status = 500;
}

export class BadRequestError extends ApiError {
	status = 400;
}

export class UnauthorizedError extends ApiError {
	status = 401;
}

export class ForbiddenError extends ApiError {
	status = 403;
}

export class NotFoundError extends ApiError {
	status = 404;
}

export class DuplicateError extends ApiError {
	status = 409;
}

export const attemptApi = attempt.builder((x) => {
	if (x instanceof ApiError) return x;

	if (typeof x === 'string') return new ApiError(x);

	return new ApiError('Something went wrong', { cause: x });
});
