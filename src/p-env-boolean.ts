import { PEnvAbstractType, PEnvTypeConfig } from './p-env-abstract-type';
import {
	safeParseFailure,
	SafeParseResult,
	safeParseSuccess,
} from './safe-parse-result';

export type PEnvBooleanConfig = PEnvTypeConfig<boolean>;

export class PEnvBoolean extends PEnvAbstractType<boolean> {
	constructor(readonly config: PEnvBooleanConfig) {
		super(config);
	}

	_safeParse(envValue: string): SafeParseResult<boolean> {
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

	static create(options: PEnvBooleanConfig): PEnvBoolean {
		return new PEnvBoolean(options);
	}
}
