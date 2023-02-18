import { PEnvBase } from './p-env-base';
import { PEnvConfig } from './p-env-config';
import { PEnvAnySchema } from './p-env-any-schema';
import { PEnvParsedProcessEnv } from './p-env-parsed-process-env';

/**
 * A schema-defined p-env class that parses `process.env` in its constructor and
 * assigns the values to `this`
 */
export type PEnv<Schema extends PEnvAnySchema> = {
	new (config?: PEnvConfig): PEnvParsedProcessEnv<Schema>;
};

/**
 * Factory for anonymous {@link PEnv} classes extending {@link PEnvBase}
 */
export function pEnvFactory<Schema extends PEnvAnySchema>(
	schema: Schema,
	classConfig: PEnvConfig = {},
): PEnv<Schema> {
	return class extends PEnvBase<Schema> {
		public constructor(instanceConfig: PEnvConfig = {}) {
			super(schema, { ...classConfig, ...instanceConfig });
		}
	} as PEnv<Schema>;
}
