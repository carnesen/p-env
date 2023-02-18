/** This module defines a field type where the parsed value is one of the
 * values provided */
import { PEnvVar, PEnvVarConfig } from '../p-env-var';
import { pEnvFailure, PEnvResult, pEnvSuccess } from '../p-env-result';
import { P_ENV_REDACTED_VALUE } from '../p-env-redacted-value';
import { PEnvError } from '../p-env-error';

type AnyValues = string[] | readonly string[];

type Parsed<Values extends AnyValues> = Values extends readonly string[]
	? Values[number]
	: Values extends string[]
	? Values[number]
	: string;

export interface PEnvStringOneOfConfig<Values extends AnyValues>
	extends PEnvVarConfig<Parsed<Values>> {
	values: Values;
}

export class PEnvStringOneOf<Values_ extends AnyValues> extends PEnvVar<
	Parsed<Values_>
> {
	private constructor(public readonly config: PEnvStringOneOfConfig<Values_>) {
		super(config);
		for (const value of this.config.values) {
			const standardized = standardizeRawValue(value);
			if (standardized !== value) {
				throw new PEnvError(
					`This field type trims whitespace from the raw environment value before attempting to match it to one of configured allowed values. The value "${value}" will never be matched because it has leading or trailing whitespace`,
				);
			}
		}
		if (!this.config.values.includes(this.config.default)) {
			throw new PEnvError(
				`Default value "${this.config.default}" is not one of the allowed values: ${this.allowedValuesString}`,
			);
		}
	}

	public safeParse(rawValue: string): PEnvResult<Parsed<Values_>> {
		const standardized = standardizeRawValue(rawValue);
		if (!this.config.values.includes(standardized)) {
			return pEnvFailure(
				`is not one of the allowed values: ${this.allowedValuesString}`,
			);
		}
		return pEnvSuccess(standardized) as PEnvResult<Parsed<Values_>>;
	}

	private readonly allowedValuesString = this.config.secret
		? P_ENV_REDACTED_VALUE
		: this.config.values.map((value) => `"${value}"`).join(', ');

	/** Factory for environment variables whose value is one of the provided
	 * values. The parsed value is typed as an item in the provided `values`
	 * array. Use a [const
	 * assertion](https://www.typescriptlang.org/docs/handbook/release-notes/typescript-3-4.html#const-assertions)
	 * to make sure its type is narrow e.g.:
	 * ```
	 * const MODES = ["normal", "fast", "ludicrous"] as const;
	 * ```
	 * */
	public static create<Values extends AnyValues>(
		options: PEnvStringOneOfConfig<Values>,
	): PEnvStringOneOf<Values> {
		return new PEnvStringOneOf(options);
	}
}

/** Function called on the raw environment variable value to trim whitespace
 * before attempting to match it against one of the configured values */
function standardizeRawValue(rawValue: string): string {
	return rawValue.trim();
}
