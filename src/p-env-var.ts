import { PEnvResult } from './p-env-result';

/**
 * Configuration for a {@link PEnvVar}
 */
export type PEnvVarConfig<Value = unknown> = {
	/**
	 * Value used for this variable if it's not present in the environment and
	 * NODE_ENV !== "production"
	 */
	default: Value;
	/**
	 * If true, use the default value even when NODE_ENV === "production". If
	 * false or undefined, this variable _must_ be provided in the process environment
	 */
	optional?: boolean;
	/**
	 * If true, the raw and parsed environment variable value will be redacted in
	 * logs and error messages
	 */
	secret?: boolean;
};

/**
 * An environment variable in a p-env schema
 */
export abstract class PEnvVar<Value = unknown> {
	protected constructor(public readonly config: PEnvVarConfig<Value>) {}

	/**
	 * Parse an environment variable raw value string if one is provided
	 */
	public abstract safeParse(rawValue: string): PEnvResult<Value>;
}
