import { PEnvError } from '../p-env-error';
import { PEnvVar, PEnvVarConfig } from '../p-env-var';
import { pEnvFailure, PEnvResult, pEnvSuccess } from '../p-env-result';

export interface PEnvStringConfig extends PEnvVarConfig<string> {
	/** If provided, a value longer than this is considered invalid */
	maxLength?: number;
}

export class PEnvString extends PEnvVar<string> {
	private constructor(public readonly config: PEnvStringConfig) {
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

	public safeParse(rawValue: string): PEnvResult<string> {
		if (
			typeof this.config.maxLength === 'number' &&
			rawValue.length > this.config.maxLength
		) {
			return pEnvFailure(`is longer than maxLength=${this.config.maxLength}`);
		}
		return pEnvSuccess(rawValue);
	}

	/** Factory for `string`-valued environment variables */
	public static create(options: PEnvStringConfig): PEnvString {
		return new PEnvString(options);
	}
}
