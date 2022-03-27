import {
	PEnvAbstractType,
	PEnvAbstractTypeConfig,
} from './p-env-abstract-type';
import {
	safeParseFailure,
	SafeParseResult,
	safeParseSuccess,
} from './safe-parse-result';

export type PEnvBooleanConfig = PEnvAbstractTypeConfig<boolean>;

export class PEnvBoolean extends PEnvAbstractType<boolean> {
	private constructor(readonly config: PEnvBooleanConfig) {
		super(config);
	}

	safeParse(envValue: string): SafeParseResult<boolean> {
		switch (envValue.trim().toLowerCase()) {
			case '1':
			case 'yes':
			case 'true': {
				return safeParseSuccess(true);
			}
			case '0':
			case 'no':
			case 'false': {
				return safeParseSuccess(false);
			}
			default: {
				return safeParseFailure("can't be converted to a boolean");
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
