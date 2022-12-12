/** The exports of this module are exported in the main index as the "p"
 * namespace object */

/** Field types */
import { PEnvBigInt } from './field-types/bigint';
export const bigint = PEnvBigInt.create;

import { PEnvBoolean } from './field-types/boolean';
export const boolean = PEnvBoolean.create;

import { PEnvDate } from './field-types/date';
export const date = PEnvDate.create;

import { PEnvJson } from './field-types/json';
export const json = PEnvJson.create;

import { PEnvNumber } from './field-types/number';
export const number = PEnvNumber.create;
export const integer = PEnvNumber.createInteger;
export const port = PEnvNumber.createPort;

import { PEnvString } from './field-types/string';
export const string = PEnvString.create;

import { PEnvStringArray } from './field-types/string-array';
export const stringArray = PEnvStringArray.create;

import { PEnvStringOneOf } from './field-types/string-one-of';
export const stringOneOf = PEnvStringOneOf.create;

export { pEnvAbstractEnvFactory as env } from './abstract-env';
