import {
	PEnvAbstractFieldType,
	PEnvFieldTypeConfig,
} from '../abstract-field-type';
import { pEnvFailure, PEnvResult, pEnvSuccess } from '../result';

export type PEnvBooleanConfig = PEnvFieldTypeConfig<boolean>;

export class PEnvBoolean extends PEnvAbstractFieldType<boolean> {
	private constructor(readonly config: PEnvBooleanConfig) {
		super(config);
	}

	safeParse(envValue: string): PEnvResult<boolean> {
		switch (envValue.trim().toLowerCase()) {
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

	/** Factory for boolean-valued environment variables. "1", "true", "yes" (and
	 * their upper-case variations) parse to `true`. "0", "false", and "no" (and
	 * their upper-case variations) parse to `false` */
	static create(options: PEnvBooleanConfig): PEnvBoolean {
		return new PEnvBoolean(options);
	}
}
