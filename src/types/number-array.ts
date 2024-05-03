import { PEnvVar } from '../p-env-var';
import { PEnvResult, pEnvSuccess } from '../p-env-result';
import { PEnvNumber, PEnvNumberConfig } from './number';

export type PEnvNumberArrayParsedValue = number[];

export type PEnvNumberArrayConfig = Omit<PEnvNumberConfig, 'default'> & {
	default: PEnvNumberArrayParsedValue;
};

export class PEnvNumberArray extends PEnvVar<PEnvNumberArrayParsedValue> {
	private constructor(public readonly config: PEnvNumberArrayConfig) {
		super(config);
	}

	public safeParse(rawValue: string): PEnvResult<PEnvNumberArrayParsedValue> {
		const splits = rawValue.split(',');
		const { default: _, ...rest } = this.config;
		/** We only use this to parse each split and the default doesn't matter */
		const pEnvNumber = PEnvNumber.create({ ...rest, default: -1 });
		const numbers: number[] = [];
		for (const spilt of splits) {
			const result = pEnvNumber.safeParse(spilt);
			if (!result.success) {
				return result;
			}
			numbers.push(result.value);
		}
		return pEnvSuccess(numbers);
	}

	/** Factory for `number[]`-valued environment variables. The raw environment
	 * value is split on "," e.g. `FOO=2,3` parses to [2, 3] */
	public static create(options: PEnvNumberArrayConfig): PEnvNumberArray {
		return new PEnvNumberArray(options);
	}
}
