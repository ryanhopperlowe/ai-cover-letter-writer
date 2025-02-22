const forceError = (e: unknown, fallbackMessage = 'Something went wrong') => {
	if (e instanceof Error) return e;
	if (typeof e === 'string') return new Error(e);
	return new Error(fallbackMessage, { cause: e });
};

export async function handlePromise<T>(promise: Promise<T>) {
	try {
		return [null, await promise] as const;
	} catch (e) {
		return [forceError(e), null] as const;
	}
}
