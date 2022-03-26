import { SafeParseResult } from './safe-parse-result';

/** Configuration options for a field in a schema */
export interface PEnvTypeConfig<ParsedValue = unknown> {
	/** Value used for this variable if it's not present in the environment and
	 * NODE_ENV !== "production" */
	default: ParsedValue;
	/** If true, use the default value even when NODE_ENV === "production". If
	 * false or undefined, this variable _must_ be provided in the environment */
	optional?: boolean;
	/** If true, the value will be redacted in logs and error messages */
	secret?: boolean;
}

export abstract class PEnvAbstractType<Parsed = unknown> {
	protected constructor(readonly config: PEnvTypeConfig<Parsed>) {}

	/** Parse an environment variable value if one is available. This method must
	 * be implemented by the extending subclass */
	public abstract safeParse(envValue: string): SafeParseResult<Parsed>;
}
