/** The exports of this module are exported in the main index as the "p"
 * namespace object */
import { PEnvNumber } from './field-types/number';
import { PEnvString } from './field-types/string';
import { PEnvBoolean } from './field-types/boolean';
import { PEnvStringArray } from './field-types/string-array';
import { pEnvAbstractEnvFactory } from './abstract-env';
import { PEnvStringOneOf } from './field-types/string-one-of';
import { PEnvJson } from './field-types/json';
import { PEnvBigInt } from './field-types/bigint';

/** Abstract env factory */
export const env = pEnvAbstractEnvFactory;

/** Types */
export const bigint = PEnvBigInt.create;
export const boolean = PEnvBoolean.create;
export const integer = PEnvNumber.createInteger;
export const json = PEnvJson.create;
export const number = PEnvNumber.create;
export const port = PEnvNumber.createPort;
export const string = PEnvString.create;
export const stringArray = PEnvStringArray.create;
export const stringOneOf = PEnvStringOneOf.create;
