import { PEnvError } from './p-env-error';
import { pEnvLoader } from './p-env-loader';
import {
	safeParseFailure,
	SafeParseResult,
	safeParseSuccess,
} from './safe-parse-result';

export interface PEnvTypeConfig<ParsedValue = unknown> {
	/** Value used for this variable if it's not present in the environment and
	 * NODE_ENV !== "production" */
	default: ParsedValue;
	/** If true, use the default value even when NODE_ENV === "production". If
	 * false or undefined, this variable _must_ be provided in the environment */
	optional?: boolean;
}

export const NODE_ENV_PRODUCTION = 'production';

export type ParseOptions = {
	NODE_ENV?: string;
};

export abstract class PEnvAbstractType<Parsed = unknown> {
	protected constructor(readonly config: PEnvTypeConfig<Parsed>) {}

	/** Parse an environment variable value if one is available */
	protected abstract _safeParse(envValue: string): SafeParseResult<Parsed>;

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

		const { NODE_ENV } = 'NODE_ENV' in options ? options : pEnvLoader();

		return NODE_ENV === NODE_ENV_PRODUCTION
			? safeParseFailure(
					`must be provided when NODE_ENV=${NODE_ENV_PRODUCTION}`,
			  )
			: safeParseSuccess(this.config.default);
	}
}
