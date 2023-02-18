/**
 * Convert a parsed value into a string for logging
 */
export function loggedValueFactory(value: unknown): string {
	return JSON.stringify(value);
}
