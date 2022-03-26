import { PEnvLoader, pEnvLoader } from './p-env-loader';
import { PEnvAbstractType } from './p-env-abstract-type';
import {
	safeParseFailure,
	SafeParseResult,
	safeParseSuccess,
} from './safe-parse-result';
import { PEnvError } from './p-env-error';
import { NODE_ENV_PRODUCTION } from './constants';

export type AnyPEnvShape = Record<string, PEnvAbstractType>;

export type PEnvParsedProcessEnv<Shape extends AnyPEnvShape> = {
	[name in keyof Shape]: Shape[name]['config']['default'];
};

export type PEnvLoggerMethod = (message: string) => unknown;

export type PEnvLogger = {
	error?: PEnvLoggerMethod;
	log?: PEnvLoggerMethod;
};

export type PEnvSchemaConfig = {
	loader?: PEnvLoader;
	logger?: PEnvLogger;
};

const REDACTED_VALUE = '<redacted>';
export class PEnvSchema<Shape extends AnyPEnvShape> {
	private constructor(
		readonly shape: Shape,
		readonly config: PEnvSchemaConfig,
	) {}

	/** Parse the global process.env, throwing on any parse/validation error
	 * @param config Configuration overrides
	 */
	parseProcessEnv(config: PEnvSchemaConfig = {}): PEnvParsedProcessEnv<Shape> {
		const safeParsed = this.safeParseProcessEnv(config);
		if (safeParsed.success) {
			return safeParsed.value;
		}
		throw new PEnvError(safeParsed.reason);
	}

	/** Parse the global process.env
	 * @param config
	 * @returns a SafeParseResult container */
	safeParseProcessEnv(
		config: PEnvSchemaConfig = {},
	): SafeParseResult<PEnvParsedProcessEnv<Shape>> {
		const combinedConfig = { ...this.config, ...config };
		const processEnv = (combinedConfig.loader || pEnvLoader)();
		const { logger } = combinedConfig;
		const parsed: Record<string, unknown> = {};
		const reasons: string[] = [];
		const { NODE_ENV } = processEnv;
		for (const [name, valueType] of Object.entries(this.shape)) {
			const envValue = processEnv[name];
			if (typeof envValue === 'string') {
				// A value was provided in the process environment
				const result = valueType.safeParse(envValue);
				if (result.success) {
					parsed[name] = result.value;
					if (logger && logger.log) {
						const loggedValue = valueType.config.secret
							? REDACTED_VALUE
							: result.value;
						logger.log(`${name}=${loggedValue}`);
					}
				} else {
					// !result.success
					const parts = [name];
					if (typeof envValue !== 'undefined') {
						const loggedEnvValue = valueType.config.secret
							? REDACTED_VALUE
							: envValue;
						parts.push(`value "${loggedEnvValue}"`);
					}
					parts.push(result.reason);
					const reason = parts.join(' ');
					reasons.push(reason);
				}
			} else {
				// No value was provided in the process environment
				if (valueType.config.optional || NODE_ENV !== NODE_ENV_PRODUCTION) {
					parsed[name] = valueType.config.default;
					const loggedValue = valueType.config.secret
						? REDACTED_VALUE
						: valueType.config.default;

					if (logger && logger.log) {
						logger.log(`${name}=${loggedValue} (default)`);
					}
				} else {
					reasons.push(`${name} is not optional nor was a value provided`);
				}
			}
		}

		if (reasons.length > 0) {
			if (logger && logger.error) {
				for (const reason of reasons) {
					logger.error(reason);
				}
			}

			return safeParseFailure(reasons.join('. '));
		}

		return safeParseSuccess(parsed as PEnvParsedProcessEnv<Shape>);
	}

	/** Factory for process.env schema declarations */
	static create<NewShape extends AnyPEnvShape>(
		shape: NewShape,
		config: PEnvSchemaConfig = {},
	): PEnvSchema<NewShape> {
		return new PEnvSchema(shape, config);
	}
}
