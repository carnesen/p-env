import { PEnvProcessEnvLoader } from './p-env-process-env-loader';
import { PEnvLogger } from './p-env-logger';

/**
 * Configuration for parsing environment variables with p-env
 */
export type PEnvConfig = {
	/**
	 * A function for loading `process.env`
	 */
	loader?: PEnvProcessEnvLoader;
	/**
	 * If provided, called with errors and/or parsed values
	 */
	logger?: PEnvLogger;
};
