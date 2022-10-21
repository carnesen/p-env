/** This module defines a field type where the parsed value is one of the
 * values provided */
import {
	PEnvAbstractFieldType,
	PEnvFieldTypeConfig,
} from '../abstract-field-type';
import { pEnvFailure, PEnvResult, pEnvSuccess } from '../result';
import { P_ENV_REDACTED_VALUE } from '../constants';
import { PEnvError } from '../error';

type AnyValues = string[] | readonly string[];

type Parsed<Values extends AnyValues> = Values extends readonly string[]
	? Values[number]
	: Values extends string[]
	? Values[number]
	: string;

export interface PEnvStringOneOfConfig<Values extends AnyValues>
	extends PEnvFieldTypeConfig<Parsed<Values>> {
	values: Values;
}

export class PEnvStringOneOf<
	Values_ extends AnyValues,
> extends PEnvAbstractFieldType<Parsed<Values_>> {
	private constructor(readonly config: PEnvStringOneOfConfig<Values_>) {
		super(config);
		for (const value of this.config.values) {
			const standardized = standardizeEnvValue(value);
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

	safeParse(envValue: string): PEnvResult<Parsed<Values_>> {
		const standardized = standardizeEnvValue(envValue);
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

	/** Factory for string-literal-valued environment variables */
	static create<Values extends AnyValues>(
		options: PEnvStringOneOfConfig<Values>,
	): PEnvStringOneOf<Values> {
		return new PEnvStringOneOf(options);
	}
}

/** Function called on the raw environment variable to trim whitespace before
 * attempting to match it against one of the config values */
function standardizeEnvValue(envValue: string): string {
	return envValue.trim();
}
