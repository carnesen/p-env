import { PEnvError } from './p-env-error';
import { loadProcessEnv } from './process-env';
import {
	safeParseFailure,
	SafeParseResult,
	safeParseSuccess,
} from './safe-parse-result';

export interface PEnvTypeConfig<ParsedValue = unknown> {
	default: ParsedValue;
	optional?: boolean;
}

export const NODE_ENV_PRODUCTION = 'production';

export type ParseOptions = {
	NODE_ENV?: string;
};

export abstract class PEnvType<Parsed = unknown> {
	constructor(readonly config: PEnvTypeConfig<Parsed>) {}

	/** Parse an environment variable value if one is available */
	abstract _safeParse(envValue: string): SafeParseResult<Parsed>;

	parse(envValue: string | undefined, options: ParseOptions = {}): Parsed {
		const safeParsed = this.safeParse(envValue, options);
		if (safeParsed.success) {
			return safeParsed.value;
		}
		throw new PEnvError(safeParsed.reason);
	}

	safeParse(
		envValue: string | undefined,
		options: ParseOptions = {},
	): SafeParseResult<Parsed> {
		if (typeof envValue !== 'undefined') {
			return this._safeParse(envValue);
		}

		// No environment value was provided

		if (this.config.optional) {
			return safeParseSuccess(this.config.default);
		}

		// Not optional

		const { NODE_ENV } = 'NODE_ENV' in options ? options : loadProcessEnv();

		return NODE_ENV === NODE_ENV_PRODUCTION
			? safeParseFailure(
					`must be provided when NODE_ENV=${NODE_ENV_PRODUCTION}`,
			  )
			: safeParseSuccess(this.config.default);
	}
}
