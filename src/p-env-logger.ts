/**
 * Function provided to p-env to log the parsed values
 */
export type PEnvLoggerMethod = (message: string) => unknown;

/**
 * Object of logging methods compatible with `console`
 */
export type PEnvLogger = {
	/**
	 * If provided, called with any parsing error before it's thrown
	 */
	error?: PEnvLoggerMethod;
	/**
	 * If provided, called with parsed values, redacted if "secret"
	 */
	log?: PEnvLoggerMethod;
};
