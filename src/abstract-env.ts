import { PEnvAbstractFieldType } from './abstract-field-type';
import { P_ENV_REDACTED_VALUE } from './constants';
import { PEnvError } from './error';
import { PEnvLoader, pEnvLoader } from './loader';

/** Generic type representing a new-able env class */
export type PEnvAbstractEnv<Schema extends PEnvAnySchema> = {
	new (config?: PEnvEnvConfig): PEnvParsedProcessEnv<Schema>;
};

export type PEnvAnySchema = Record<string, PEnvAbstractFieldType>;

export type PEnvParsedProcessEnv<Schema extends PEnvAnySchema> = {
	[name in keyof Schema]: Schema[name]['config']['default'];
};

export type PEnvLoggerMethod = (message: string) => unknown;

export type PEnvLogger = {
	error?: PEnvLoggerMethod;
	log?: PEnvLoggerMethod;
};

export type PEnvEnvConfig = {
	loader?: PEnvLoader;
	logger?: PEnvLogger;
};

export const NODE_ENV_PRODUCTION = 'production';

/** A factory for p-env environment classes */
export function pEnvAbstractEnvFactory<Schema extends PEnvAnySchema>(
	schema: Schema,
): PEnvAbstractEnv<Schema> {
	/** Abstract class returned by the factory as a PEnvAbstractEnv<Schema>.
	 * TypeScript doesn't enforce the `abstract` nature of this class because we
	 * assert the returned type but we'll still mark it as `abstract` to
	 * emphasize the intended use. We could return it as an anonymous class but
	 * named classes read better in stack traces. Tack on an "_" at the end of
	 * the class name to avoid a conflict with the generic type PEnvAbstractEnv
	 * */
	abstract class PEnvAbstractEnv_ {
		public constructor(config: PEnvEnvConfig = {}) {
			const processEnv = (config.loader || pEnvLoader)();
			const { logger } = config;
			const parsed: Record<string, unknown> = {};
			const reasons: string[] = [];
			const { NODE_ENV } = processEnv;
			for (const [name, valueType] of Object.entries(schema)) {
				const rawValue = processEnv[name];
				if (typeof rawValue === 'string') {
					// A value was provided in the process environment
					const result = valueType.safeParse(rawValue);
					if (result.success) {
						parsed[name] = result.value;
						if (logger && logger.log) {
							const loggedValue: string = valueType.config.secret
								? P_ENV_REDACTED_VALUE
								: loggedValueFromParsedValue(result.value);

							const loggedRawValue: string = valueType.config.secret
								? P_ENV_REDACTED_VALUE
								: rawValue;

							logger.log(`${name}=${loggedValue} ("${loggedRawValue}")`);
						}
					} else {
						// !result.success
						const parts = [name];
						if (typeof rawValue !== 'undefined') {
							const loggedEnvValue = valueType.config.secret
								? P_ENV_REDACTED_VALUE
								: rawValue;
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
						const loggedValue: string = valueType.config.secret
							? P_ENV_REDACTED_VALUE
							: loggedValueFromParsedValue(valueType.config.default);

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
	}

	return PEnvAbstractEnv_ as PEnvAbstractEnv<Schema>;
}

export function loggedValueFromParsedValue(value: unknown): string {
	return JSON.stringify(value);
}
