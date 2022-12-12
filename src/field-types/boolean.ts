import {
	PEnvAbstractFieldType,
	PEnvFieldTypeConfig,
} from '../abstract-field-type';
import { pEnvFailure, PEnvResult, pEnvSuccess } from '../result';

export type PEnvBooleanConfig = PEnvFieldTypeConfig<boolean>;

export class PEnvBoolean extends PEnvAbstractFieldType<boolean> {
	private constructor(public readonly config: PEnvBooleanConfig) {
		super(config);
	}

	public safeParse(rawValue: string): PEnvResult<boolean> {
		switch (rawValue.trim().toLowerCase()) {
			case '1':
			case 'yes':
			case 'true': {
				return pEnvSuccess(true);
			}
			case '0':
			case 'no':
			case 'false': {
				return pEnvSuccess(false);
			}
			default: {
				return pEnvFailure("can't be converted to a boolean");
			}
		}
	}

	/** Factory for boolean-valued environment variables with mappings:
	 * - `true`: any string lower-casing to "1", "true" or "yes"
	 * - `false`: any string lower-casing to "0", "false", or "no"
	 *
	 * Note that this does *not* adhere to the convention that if *any*
	 * environment value is present (e.g. even "false"), that should be
	 * interpreted as `true`. The convention used here allows us to define
	 * `boolean`-valued fields with default value `false`. Doing so, however, may
	 * cause cognitive dissonance for folks that are used to the other
	 * convention.
	 * */
	public static create(options: PEnvBooleanConfig): PEnvBoolean {
		return new PEnvBoolean(options);
	}
}
