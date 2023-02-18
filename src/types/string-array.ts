import { PEnvVar, PEnvVarConfig } from '../p-env-var';
import { PEnvResult, pEnvSuccess } from '../p-env-result';

export type PEnvStringArrayConfig = PEnvVarConfig<string[]>;

export class PEnvStringArray extends PEnvVar<string[]> {
	private constructor(public readonly config: PEnvStringArrayConfig) {
		super(config);
	}

	public safeParse(rawValue: string): PEnvResult<string[]> {
		return pEnvSuccess(rawValue.split(','));
	}

	/** Factory for `string[]`-valued environment variables. The raw environment
	 * value is split on "," e.g. `FOO=bar,baz` parses to ["bar", "baz"] */
	public static create(options: PEnvStringArrayConfig): PEnvStringArray {
		return new PEnvStringArray(options);
	}
}
