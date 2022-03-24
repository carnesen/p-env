/** The exports of this module are exported in the main index as the primary
 * external API, "p" */
import { PEnvParsedProcessEnv, PEnvSchema } from './p-env-schema';
import { PEnvNumber } from './p-env-number';
import { PEnvString } from './p-env-string';
import { PEnvBoolean } from './p-env-boolean';
import { PEnvStringArray } from './p-env-string-array';

const boolean = PEnvBoolean.create;
const integer = PEnvNumber.createInteger;
const number = PEnvNumber.create;
const port = PEnvNumber.createPort;
const string = PEnvString.create;
const stringArray = PEnvStringArray.create;
const schema = PEnvSchema.create;

/** Helper for inferring the return type of schema.parse */
type TypeOfParsedProcessEnv<Schema> = Schema extends PEnvSchema<infer Shape>
	? PEnvParsedProcessEnv<Shape>
	: unknown;

export {
	boolean,
	TypeOfParsedProcessEnv as infer,
	integer,
	number,
	port,
	schema,
	string,
	stringArray,
};
