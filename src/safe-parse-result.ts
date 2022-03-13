export type SafeParseSuccess<Value = unknown> = {
	success: true;
	value: Value;
};

export function safeParseSuccess<Value = unknown>(
	value: Value,
): SafeParseSuccess<Value> {
	return {
		success: true,
		value,
	};
}

export type SafeParseFailure = { success: false; reason: string };

export function safeParseFailure(reason: string): SafeParseFailure {
	return {
		success: false,
		reason,
	};
}

export type SafeParseResult<ParsedValue = unknown> =
	| SafeParseSuccess<ParsedValue>
	| SafeParseFailure;
