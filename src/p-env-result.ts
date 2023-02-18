/** This module defines a discriminating union type returned by the field type
 * `safeParse` method. */

export type PEnvSuccess<Value = unknown> = {
	success: true;
	value: Value;
};

/** Factory for `success: true` objects */
export function pEnvSuccess<Value = unknown>(value: Value): PEnvSuccess<Value> {
	return {
		success: true,
		value,
	};
}

export type PEnvFailure = { success: false; reason: string };

/** Factory for `success: false` objects */
export function pEnvFailure(reason: string): PEnvFailure {
	return {
		success: false,
		reason,
	};
}

/** `success`-discriminated union of allowed safeParse result object types */
export type PEnvResult<ParsedValue = unknown> =
	| PEnvSuccess<ParsedValue>
	| PEnvFailure;
