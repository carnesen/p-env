import { PEnvBase } from './p-env-base';
import { PEnvConfig } from './p-env-config';
import { PEnvAnySchema } from './p-env-any-schema';
import { PEnvParsedProcessEnv } from './p-env-parsed-process-env';

/** Generic type representing a new-able env class */
export type PEnv<Schema extends PEnvAnySchema> = {
	new (config?: PEnvConfig): PEnvParsedProcessEnv<Schema>;
};

/** A factory for {@link PEnvBase} abstract classes */
export function pEnvFactory<Schema extends PEnvAnySchema>(
	schema: Schema,
): PEnv<Schema> {
	/** Abstract class returned by the factory as a PEnvAbstractEnv<Schema>.
	 * TypeScript doesn't enforce the `abstract` nature of this class because we
	 * assert the returned type but we'll still mark it as `abstract` to
	 * emphasize the intended use. We could return it as an anonymous class but
	 * named classes read better in stack traces. Tack on an "_" at the end of
	 * the class name to avoid a conflict with the generic type PEnvAbstractEnv
	 * */
	abstract class PEnv_ extends PEnvBase<Schema> {
		public constructor(config: PEnvConfig = {}) {
			super(schema, config);
		}
	}

	return PEnv_ as PEnv<Schema>;
}
