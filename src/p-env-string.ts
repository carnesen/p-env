import { PEnvError } from './p-env-error';
import { PEnvAbstractType, PEnvTypeConfig } from './p-env-abstract-type';
import {
	safeParseFailure,
	SafeParseResult,
	safeParseSuccess,
} from './safe-parse-result';

export interface PEnvStringConfig extends PEnvTypeConfig<string> {
	/** If provided, a value longer than this is considered invalid */
	maxLength?: number;
}

export class PEnvString extends PEnvAbstractType<string> {
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

	protected _safeParse(envValue: string): SafeParseResult<string> {
		if (
			typeof this.config.maxLength === 'number' &&
			envValue.length > this.config.maxLength
		) {
			return safeParseFailure(
				`is longer than maxLength=${this.config.maxLength}`,
			);
		}
		return safeParseSuccess(envValue);
	}

	/** Factory for `string`-valued environment variables */
	static create(options: PEnvStringConfig): PEnvString {
		return new PEnvString(options);
	}
}
