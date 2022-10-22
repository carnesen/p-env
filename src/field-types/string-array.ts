import {
	PEnvAbstractFieldType,
	PEnvFieldTypeConfig,
} from '../abstract-field-type';
import { PEnvResult, pEnvSuccess } from '../result';

export type PEnvStringArrayConfig = PEnvFieldTypeConfig<string[]>;

export class PEnvStringArray extends PEnvAbstractFieldType<string[]> {
	private constructor(readonly config: PEnvStringArrayConfig) {
		super(config);
	}

	safeParse(rawValue: string): PEnvResult<string[]> {
		return pEnvSuccess(rawValue.split(','));
	}

	/** Factory for `string[]`-valued environment variables. The raw environment
	 * value is split on "," e.g. `FOO=bar,baz` parses to ["bar", "baz"] */
	static create(options: PEnvStringArrayConfig): PEnvStringArray {
		return new PEnvStringArray(options);
	}
}
