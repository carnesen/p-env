import { PEnvVar } from '../p-env-var';
import { PEnvResult, pEnvSuccess } from '../p-env-result';
import {
	PEnvStringOneOf,
	PEnvStringOneOfAnyValues,
	PEnvStringOneOfConfig,
	PEnvStringOneOfParsedValue,
} from './string-one-of';

export type PEnvStringOneOfArrayParsedValue<
	Values extends PEnvStringOneOfAnyValues,
> = PEnvStringOneOfParsedValue<Values>[];

export type PEnvStringOneOfArrayConfig<
	Values extends PEnvStringOneOfAnyValues,
> = Omit<PEnvStringOneOfConfig<Values>, 'default'> & {
	default: PEnvStringOneOfArrayParsedValue<Values>;
};

export class PEnvStringOneOfArray<
	Values_ extends PEnvStringOneOfAnyValues,
> extends PEnvVar<PEnvStringOneOfArrayParsedValue<Values_>> {
	private constructor(
		public readonly config: PEnvStringOneOfArrayConfig<Values_>,
	) {
		super(config);
	}

	public safeParse(
		rawValue: string,
	): PEnvResult<PEnvStringOneOfArrayParsedValue<Values_>> {
		const splits = rawValue.split(',');
		const { default: _, ...rest } = this.config;
		/** We only use this to parse each split and the default doesn't matter */
		const pEnvStringOneOf = PEnvStringOneOf.create<Values_>({
			...rest,
			default: this.config.values[0] as PEnvStringOneOfParsedValue<Values_>,
		});
		const parsedValues: PEnvStringOneOfParsedValue<Values_>[] = [];
		for (const spilt of splits) {
			const result = pEnvStringOneOf.safeParse(spilt);
			if (!result.success) {
				return result;
			}
			parsedValues.push(result.value);
		}
		return pEnvSuccess(parsedValues);
	}

	/** Factory for `number[]`-valued environment variables. The raw environment
	 * value is split on "," e.g. `FOO=2,3` parses to [2, 3] */
	public static create<const Values extends PEnvStringOneOfAnyValues>(
		options: PEnvStringOneOfArrayConfig<Values>,
	): PEnvStringOneOfArray<Values> {
		return new PEnvStringOneOfArray(options);
	}
}
