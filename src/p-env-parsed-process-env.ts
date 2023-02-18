import { PEnvAnySchema } from './p-env-any-schema';

/**
 * Shape of a process environment parsed by p-env
 */
export type PEnvParsedProcessEnv<Schema extends PEnvAnySchema> = {
	[name in keyof Schema]: Schema[name]['config']['default'];
};
