import { loadProcessEnv, ProcessEnv } from './process-env';
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

export type PEnvParseProcessEnvOptions = {
	logger?: PEnvLogger;
	processEnv?: ProcessEnv;
};

export class PEnvSchema<Shape extends AnyPEnvShape> {
	private constructor(readonly shape: Shape) {}

	/** Parse the global process.env, throwing on any parse/validation error */
	parseProcessEnv(
		options: PEnvParseProcessEnvOptions = {},
	): PEnvParsedProcessEnv<Shape> {
		const safeParsed = this.safeParseProcessEnv(options);
		if (safeParsed.success) {
			return safeParsed.value;
		}
		throw new PEnvError(safeParsed.reason);
	}

	/** Parse the global process.env, returning a SafeParseResult container */
	safeParseProcessEnv(
		options: PEnvParseProcessEnvOptions = {},
	): SafeParseResult<PEnvParsedProcessEnv<Shape>> {
		const { processEnv = loadProcessEnv(), logger } = options;
		const parsed: Record<string, unknown> = {};
		const reasons: string[] = [];
		const { NODE_ENV } = processEnv;
		for (const [name, valueType] of Object.entries(this.shape)) {
			const envValue = processEnv[name];
			const result = valueType.safeParse(envValue, { NODE_ENV });
			if (result.success) {
				parsed[name] = result.value;
				if (logger && logger.log) {
					const loggedValue = name.toLowerCase().includes('secret')
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
	): PEnvSchema<NewShape> {
		return new PEnvSchema(shape);
	}
}
