import { PEnvError } from '../error';
import {
	PEnvAbstractFieldType,
	PEnvFieldTypeConfig,
} from '../abstract-field-type';
import { pEnvFailure, PEnvResult, pEnvSuccess } from '../result';

export interface PEnvStringConfig extends PEnvFieldTypeConfig<string> {
	/** If provided, a value longer than this is considered invalid */
	maxLength?: number;
}

export class PEnvString extends PEnvAbstractFieldType<string> {
	private constructor(readonly config: PEnvStringConfig) {
		super(config);
		if (config.maxLength) {
			if (config.maxLength < 0) {
				throw new PEnvError('Config.maxLength must be non-negative');
			}
			if (config.default.length > config.maxLength) {
				throw new PEnvError(
					`Default value "${config.default}" is longer than maxLength=${config.maxLength}`,
				);
			}
		}
	}

	safeParse(envValue: string): PEnvResult<string> {
		if (
			typeof this.config.maxLength === 'number' &&
			envValue.length > this.config.maxLength
		) {
			return pEnvFailure(`is longer than maxLength=${this.config.maxLength}`);
		}
		return pEnvSuccess(envValue);
	}

	/** Factory for `string`-valued environment variables */
	static create(options: PEnvStringConfig): PEnvString {
		return new PEnvString(options);
	}
}
