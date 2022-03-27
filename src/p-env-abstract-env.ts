import { PEnvAbstractType } from './p-env-abstract-type';
import { PEnvError } from './p-env-error';
import { PEnvLoader, pEnvLoader } from './p-env-loader';

/** Generic type representing a new-able env class */
export type PEnvAbstractEnv<Shape extends PEnvAnyShape> = {
	// eslint-disable-next-line @typescript-eslint/no-explicit-any
	new (config?: PEnvAbstractEnvConfig): PEnvParsedProcessEnv<Shape>;
};

export type PEnvAnyShape = Record<string, PEnvAbstractType>;

export type PEnvParsedProcessEnv<Shape extends PEnvAnyShape> = {
	[name in keyof Shape]: Shape[name]['config']['default'];
};

export type PEnvLoggerMethod = (message: string) => unknown;

export type PEnvLogger = {
	error?: PEnvLoggerMethod;
	log?: PEnvLoggerMethod;
};

export type PEnvAbstractEnvConfig = {
	loader?: PEnvLoader;
	logger?: PEnvLogger;
};

const REDACTED_VALUE = '<redacted>';

export const NODE_ENV_PRODUCTION = 'production';

export function pEnvAbstractEnvFactory<Shape extends PEnvAnyShape>(
	shape: Shape,
): PEnvAbstractEnv<Shape> {
	return class Env {
		constructor(config: PEnvAbstractEnvConfig = {}) {
			const processEnv = (config.loader || pEnvLoader)();
			const { logger } = config;
			const parsed: Record<string, unknown> = {};
			const reasons: string[] = [];
			const { NODE_ENV } = processEnv;
			for (const [name, valueType] of Object.entries(shape)) {
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
				throw new PEnvError(reasons.join('. '));
			}

			Object.assign(this, parsed);
		}
	} as PEnvAbstractEnv<Shape>;
}
