export type SafeParseSuccess<Value = unknown> = {
	success: true;
	value: Value;
};

/** Factory for SafeParseSuccess objects */
export function safeParseSuccess<Value = unknown>(
	value: Value,
): SafeParseSuccess<Value> {
	return {
		success: true,
		value,
	};
}

export type SafeParseFailure = { success: false; reason: string };

/** Factory for SafeParseFailure objects */
export function safeParseFailure(reason: string): SafeParseFailure {
	return {
		success: false,
		reason,
	};
}

/** success-discriminated union of possible safeParse results */
export type SafeParseResult<ParsedValue = unknown> =
	| SafeParseSuccess<ParsedValue>
	| SafeParseFailure;
