import { PEnvError } from '../error';
import {
	PEnvAbstractFieldType,
	PEnvFieldTypeConfig,
} from '../abstract-field-type';
import { pEnvFailure, PEnvResult, pEnvSuccess } from '../result';

/** Maximum allowed value for a "port" variable */
export const PORT_MAXIMUM = 65535;
/** Minimum allowed value for a "port" variable */
export const PORT_MINIMUM = 0;

/** Configuration options for the `integer` value factory */
export interface PEnvIntegerConfig extends PEnvFieldTypeConfig<number> {
	/** If provided, values greater than this are considered invalid */
	maximum?: number;
	/** If provided, values less than this are considered invalid */
	minimum?: number;
}

/** Configuration options for the `port` value factory */
export type PEnvPortConfig = PEnvIntegerConfig;

/** Configuration options for the `number` value factory */
export interface PEnvNumberConfig extends PEnvIntegerConfig {
	/** If true, non-integer values are considered invalid */
	integer?: boolean;
}

export class PEnvNumber extends PEnvAbstractFieldType<number> {
	private constructor(readonly config: PEnvNumberConfig) {
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

	safeParse(envValue: string): PEnvResult<number> {
		const failureToConvert = pEnvFailure("can't be converted to a number");
		const trimmed = envValue.trim();
		if (trimmed.length === 0) {
			return failureToConvert;
		}
		const parsed = Number(envValue);

		if (Number.isNaN(parsed)) {
			return failureToConvert;
		}

		if (this.config.integer && !Number.isInteger(parsed)) {
			return pEnvFailure('is not an integer');
		}

		if (
			typeof this.config.minimum === 'number' &&
			parsed < this.config.minimum
		) {
			return pEnvFailure(`is less than the minimum ${this.config.minimum}`);
		}

		if (
			typeof this.config.maximum === 'number' &&
			parsed > this.config.maximum
		) {
			return pEnvFailure(`is greater than the maximum ${this.config.maximum}`);
		}

		return pEnvSuccess(parsed);
	}

	/** Factory for `number`-valued environment variables */
	static create(config: PEnvNumberConfig): PEnvNumber {
		return new PEnvNumber(config);
	}

	/** Factory for integer-valued (`number`) environment variables. */
	static createInteger(config: PEnvIntegerConfig): PEnvNumber {
		return new PEnvNumber({ ...config, integer: true });
	}

	/** Factory for integer-valued (`number`) environment variables between 0 and
	 * 65535, suitable for usage as a server [IP
	 * port](https://en.wikipedia.org/wiki/Port_(computer_networking)) */
	static createPort(config: PEnvPortConfig): PEnvNumber {
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
