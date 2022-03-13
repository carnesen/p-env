import { PEnvType, PEnvTypeConfig } from './p-env-type';
import {
	safeParseFailure,
	SafeParseResult,
	safeParseSuccess,
} from './safe-parse-result';

const MAXIMUM_PORT = 65535;
const MINIMUM_PORT = 0;

export interface PEnvIntegerConfig extends PEnvTypeConfig<number> {
	maximum?: number;
	minimum?: number;
}

export interface PEnvNumberConfig extends PEnvIntegerConfig {
	integer?: boolean;
}

export class PEnvNumber extends PEnvType<number> {
	constructor(readonly config: PEnvNumberConfig) {
		super(config);
		if (config.maximum) {
			if (config.integer && !Number.isInteger(config.maximum)) {
				throw new Error(
					`config.maximum ${config.maximum} is not an integer but config.integer is set to true`,
				);
			}
			if (config.default > config.maximum) {
				throw new Error(
					`Default value "${config.default}" is greater than than maximum allowed value ${config.maximum}`,
				);
			}
		}
		if (config.minimum) {
			if (config.integer && !Number.isInteger(config.minimum)) {
				throw new Error(
					`Config.maximum ${config.maximum} is not an integer but config.integer is set to true`,
				);
			}
			if (config.default < config.minimum) {
				throw new Error(
					`Default value "${config.default}" is less than than minimum allowed value ${config.maximum}`,
				);
			}
		}
	}

	_safeParse(envValue: string): SafeParseResult<number> {
		const failureToConvert = safeParseFailure("can't be converted to a number");
		const trimmed = envValue.trim();
		if (trimmed.length === 0) {
			return failureToConvert;
		}
		const parsed = Number(envValue);
		if (Number.isNaN(parsed)) {
			return failureToConvert;
		}
		if (this.config.integer && !Number.isInteger(parsed)) {
			return safeParseFailure('is not an integer');
		}
		return safeParseSuccess(parsed);
	}

	static create(options: PEnvNumberConfig): PEnvNumber {
		return new PEnvNumber(options);
	}

	static createInteger(options: PEnvIntegerConfig): PEnvNumber {
		return new PEnvNumber({ ...options, integer: true });
	}

	static createPort(options: PEnvIntegerConfig): PEnvNumber {
		return new PEnvNumber({
			...options,
			maximum:
				typeof options.maximum === 'number'
					? Math.min(options.maximum, MAXIMUM_PORT)
					: MAXIMUM_PORT,
			minimum:
				typeof options.minimum === 'number'
					? Math.max(options.minimum, MINIMUM_PORT)
					: MINIMUM_PORT,
		});
	}
}
