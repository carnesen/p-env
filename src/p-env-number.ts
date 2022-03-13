import { PEnvError } from './p-env-error';
import { PEnvType, PEnvTypeConfig } from './p-env-type';
import {
	safeParseFailure,
	SafeParseResult,
	safeParseSuccess,
} from './safe-parse-result';

export const PORT_MAXIMUM = 65535;
export const PORT_MINIMUM = 0;

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
				throw new PEnvError(
					`Config.maximum (${config.maximum}) is not an integer but config.integer is \`true\``,
				);
			}
			if (config.default > config.maximum) {
				throw new PEnvError(
					`Config.default (${config.default}) is greater than config.maximum (${config.maximum})`,
				);
			}
		}

		if (config.minimum) {
			if (config.integer && !Number.isInteger(config.minimum)) {
				throw new PEnvError(
					`Config.maximum (${config.maximum}) is not an integer but config.integer is \`true\``,
				);
			}
			if (config.default < config.minimum) {
				throw new PEnvError(
					`Config.default (${config.default}) is less than config.maximum (${config.maximum})`,
				);
			}
		}

		if (config.integer && !Number.isInteger(config.default)) {
			throw new PEnvError(
				`Config.default (${config.default}) is not an integer but config.integer is set to \`true\``,
			);
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

		if (
			typeof this.config.minimum === 'number' &&
			parsed < this.config.minimum
		) {
			return safeParseFailure(
				`is less than the minimum ${this.config.minimum}`,
			);
		}

		if (
			typeof this.config.maximum === 'number' &&
			parsed > this.config.maximum
		) {
			return safeParseFailure(
				`is greater than the maximum ${this.config.maximum}`,
			);
		}

		return safeParseSuccess(parsed);
	}

	static create(config: PEnvNumberConfig): PEnvNumber {
		return new PEnvNumber(config);
	}

	static createInteger(config: PEnvIntegerConfig): PEnvNumber {
		return new PEnvNumber({ ...config, integer: true });
	}

	static createPort(config: PEnvIntegerConfig): PEnvNumber {
		const maximum =
			typeof config.maximum === 'number' ? config.maximum : PORT_MAXIMUM;
		if (maximum > PORT_MAXIMUM) {
			throw new PEnvError(
				`Config.maximum (${config.maximum}) is greater than the maximum port maximum (${PORT_MAXIMUM})`,
			);
		}

		const minimum =
			typeof config.minimum === 'number' ? config.minimum : PORT_MINIMUM;
		if (minimum < PORT_MINIMUM) {
			throw new PEnvError(
				`Config.minimum (${config.minimum}) is less than the minimum port minimum (${PORT_MINIMUM})`,
			);
		}

		return PEnvNumber.createInteger({
			...config,
			maximum,
			minimum,
		});
	}
}
