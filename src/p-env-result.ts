/**
 * This module defines a discriminating union type returned by the p-env
 * environment variable `safeParse` method
 */

/**
 * Type returned by an environment variable's `safeParse` method on success
 */
export type PEnvSuccess<Value = unknown> = {
	success: true;
	value: Value;
};

/**
 * Factory for {@link PEnvSuccess} containers
 */
export function pEnvSuccess<Value = unknown>(value: Value): PEnvSuccess<Value> {
	return {
		success: true,
		value,
	};
}

/**
 * Type returned by an environment variable's `safeParse` method on failure
 */
export type PEnvFailure = { success: false; reason: string };

/**
 * Factory for {@link PEnvFailure} containers
 */
export function pEnvFailure(reason: string): PEnvFailure {
	return {
		success: false,
		reason,
	};
}

/**
 * `success`-discriminated union of `safeParse` container types
 */
export type PEnvResult<ParsedValue = unknown> =
	| PEnvSuccess<ParsedValue>
	| PEnvFailure;
