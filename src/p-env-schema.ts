import { loadProcessEnv } from './process-env';
import { PEnvType } from './p-env-type';
import {
	safeParseFailure,
	SafeParseResult,
	safeParseSuccess,
} from './safe-parse-result';

export type AnyPEnvShape = Record<string, PEnvType>;

export type PEnvParsed<Shape extends AnyPEnvShape> = {
	[name in keyof Shape]: Shape[name]['config']['default'];
};

export class PEnvSchema<Shape extends AnyPEnvShape> {
	constructor(readonly shape: Shape) {}

	parse(processEnv = loadProcessEnv()): PEnvParsed<Shape> {
		const safeParsed = this.safeParse(processEnv);
		if (safeParsed.success) {
			return safeParsed.value;
		}
		throw new Error(safeParsed.reason);
	}

	safeParse(processEnv = loadProcessEnv()): SafeParseResult<PEnvParsed<Shape>> {
		const parsed: Record<string, unknown> = {};
		const failureReasons: string[] = [];
		const { NODE_ENV } = processEnv;
		for (const [name, valueType] of Object.entries(this.shape)) {
			const envValue = processEnv[name];
			const result = valueType.safeParse(envValue, { NODE_ENV });
			if (result.success) {
				parsed[name] = result.value;
			} else {
				const parts = [name];
				if (typeof envValue !== 'undefined') {
					parts.push(`value "${envValue}"`);
				}
				parts.push(result.reason);
				failureReasons.push(parts.join(' '));
			}
		}

		if (failureReasons.length > 0) {
			return safeParseFailure(failureReasons.join('. '));
		}

		return safeParseSuccess(parsed as PEnvParsed<Shape>);
	}

	static create<NewShape extends AnyPEnvShape>(
		shape: NewShape,
	): PEnvSchema<NewShape> {
		return new PEnvSchema(shape);
	}
}
