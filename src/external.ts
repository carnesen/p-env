import { PEnvParsed, PEnvSchema } from './p-env-schema';
import { PEnvNumber } from './p-env-number';
import { PEnvString } from './p-env-string';

export * from './p-env-number';
export * from './p-env-schema';
export * from './p-env-string';
export * from './p-env-type';
export * from './process-env';
export * from './safe-parse-result';

const integer = PEnvNumber.createInteger;
const number = PEnvNumber.create;
const port = PEnvNumber.createPort;
const string = PEnvString.create;
const schema = PEnvSchema.create;

type TypeOfParsed<Schema> = Schema extends PEnvSchema<infer Shape>
	? PEnvParsed<Shape>
	: unknown;

export { TypeOfParsed as infer, integer, number, port, schema, string };
