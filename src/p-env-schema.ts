import { PEnvLoader, pEnvLoader } from './p-env-loader';
import { PEnvAbstractType } from './p-env-abstract-type';
import {
	safeParseFailure,
	SafeParseResult,
	safeParseSuccess,
} from './safe-parse-result';
import { PEnvError } from './p-env-error';

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
			const result = valueType.safeParse(envValue, { NODE_ENV });
			if (result.success) {
				parsed[name] = result.value;
				if (logger && logger.log) {
					const loggedValue = valueType.config.secret
						? 'xxxxxxx'
						: result.value;
					logger.log(`${name}=${loggedValue}`);
				}
			} else {
				const parts = [name];
				if (typeof envValue !== 'undefined') {
					parts.push(`value "${envValue}"`);
				}
				parts.push(result.reason);
				const reason = parts.join(' ');
				if (logger && logger.error) {
					logger.error(reason);
				}
				reasons.push(reason);
			}
		}

		if (reasons.length > 0) {
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
