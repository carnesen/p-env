/** The exports of this module are exported in the main index as the primary
 * external API, "p" */
import { PEnvNumber } from './p-env-number';
import { PEnvString } from './p-env-string';
import { PEnvBoolean } from './p-env-boolean';
import { PEnvStringArray } from './p-env-string-array';
import { pEnvAbstractEnvFactory } from './p-env-abstract-env';

/** Abstract env factory */
export const env = pEnvAbstractEnvFactory;

/** Types */
export const boolean = PEnvBoolean.create;
export const integer = PEnvNumber.createInteger;
export const number = PEnvNumber.create;
export const port = PEnvNumber.createPort;
export const string = PEnvString.create;
export const stringArray = PEnvStringArray.create;
