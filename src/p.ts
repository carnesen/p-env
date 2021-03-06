/** The exports of this module are exported in the main index as the "p"
 * namespace object */
import { PEnvNumber } from './field-types/number';
import { PEnvString } from './field-types/string';
import { PEnvBoolean } from './field-types/boolean';
import { PEnvStringArray } from './field-types/string-array';
import { pEnvAbstractEnvFactory } from './abstract-env';

/** Abstract env factory */
export const env = pEnvAbstractEnvFactory;

/** Types */
export const boolean = PEnvBoolean.create;
export const integer = PEnvNumber.createInteger;
export const number = PEnvNumber.create;
export const port = PEnvNumber.createPort;
export const string = PEnvString.create;
export const stringArray = PEnvStringArray.create;
