import { P_ENV_REDACTED_VALUE } from './p-env-redacted-value';
import { PEnvError } from './p-env-error';
import { loggedValueFactory } from './logged-value-factory';
import { pEnvProcessEnvLoader } from './p-env-process-env-loader';
import { PEnvConfig } from './p-env-config';
import { PEnvAnySchema } from './p-env-any-schema';

/**
 * Base class extended by p.env
 *
 * This class's constructor parses `process.env` and assigns the values to
 * `this`.
 */
export abstract class PEnvBase<Schema extends PEnvAnySchema> {
	public constructor(schema: Schema, config: PEnvConfig) {
		const processEnv = (config.loader || pEnvProcessEnvLoader)();
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
							: loggedValueFactory(result.value);

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
				if (valueType.config.optional || NODE_ENV !== 'production') {
					parsed[name] = valueType.config.default;
					const loggedValue: string = valueType.config.secret
						? P_ENV_REDACTED_VALUE
						: loggedValueFactory(valueType.config.default);

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
