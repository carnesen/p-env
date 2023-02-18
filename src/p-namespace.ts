/** The exports of this module are exported in the main index as the "p"
 * namespace object */

/** Field types */
import { PEnvBigInt } from './types/bigint';
export const bigint = PEnvBigInt.create;

import { PEnvBoolean } from './types/boolean';
export const boolean = PEnvBoolean.create;

import { PEnvDate } from './types/date';
export const date = PEnvDate.create;

import { PEnvJson } from './types/json';
export const json = PEnvJson.create;

import { PEnvNumber } from './types/number';
export const number = PEnvNumber.create;
export const integer = PEnvNumber.createInteger;
export const port = PEnvNumber.createPort;

import { PEnvString } from './types/string';
export const string = PEnvString.create;

import { PEnvStringArray } from './types/string-array';
export const stringArray = PEnvStringArray.create;

import { PEnvStringOneOf } from './types/string-one-of';
export const stringOneOf = PEnvStringOneOf.create;

export { pEnvFactory as env } from './p-env';
