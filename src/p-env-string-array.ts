import { PEnvAbstractType, PEnvTypeConfig } from './p-env-abstract-type';
import { SafeParseResult, safeParseSuccess } from './safe-parse-result';

export type PEnvStringArrayConfig = PEnvTypeConfig<string[]>;

export class PEnvStringArray extends PEnvAbstractType<string[]> {
	private constructor(readonly config: PEnvStringArrayConfig) {
		super(config);
	}

	protected _safeParse(envValue: string): SafeParseResult<string[]> {
		return safeParseSuccess(envValue.split(','));
	}

	/** Factory for `string[]`-valued environment variables. The raw environment
	 * value is split on "," e.g. `FOO=bar,baz` parses to ["bar", "baz"] */
	static create(options: PEnvStringArrayConfig): PEnvStringArray {
		return new PEnvStringArray(options);
	}
}
