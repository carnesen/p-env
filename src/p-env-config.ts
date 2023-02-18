import { PEnvProcessEnvLoader } from './p-env-process-env-loader';
import { PEnvLogger } from './p-env-logger';

export type PEnvConfig = {
	loader?: PEnvProcessEnvLoader;
	logger?: PEnvLogger;
};
