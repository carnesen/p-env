import { PEnvParsedProcessEnv, PEnvSchema } from './p-env-schema';
import { PEnvNumber } from './p-env-number';
import { PEnvString } from './p-env-string';
import { PEnvBoolean } from './p-env-boolean';

export * from './p-env-boolean';
export * from './p-env-error';
export * from './p-env-number';
export * from './p-env-schema';
export * from './p-env-string';
export * from './p-env-abstract-type';
export * from './process-env';
export * from './safe-parse-result';

const boolean = PEnvBoolean.create;
const integer = PEnvNumber.createInteger;
const number = PEnvNumber.create;
const port = PEnvNumber.createPort;
const string = PEnvString.create;
const schema = PEnvSchema.create;

type TypeOfParsed<Schema> = Schema extends PEnvSchema<infer Shape>
	? PEnvParsedProcessEnv<Shape>
	: unknown;

export {
	boolean,
	TypeOfParsed as infer,
	integer,
	number,
	port,
	schema,
	string,
};
