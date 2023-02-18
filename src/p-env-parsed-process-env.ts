import { PEnvAnySchema } from './p-env-any-schema';

export type PEnvParsedProcessEnv<Schema extends PEnvAnySchema> = {
	[name in keyof Schema]: Schema[name]['config']['default'];
};
