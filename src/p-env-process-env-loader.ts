/**
 * To make p-env
 * [isomorphic](https://en.wikipedia.org/wiki/Isomorphic_JavaScript) and
 * independent of "@types/node", this module defines a type and getter for
 * process.env
 */

/**
 * [Isomorphic](https://en.wikipedia.org/wiki/Isomorphic_JavaScript) type for
 * globalThis.process.env
 */
export type PEnvProcessEnv = Record<string, string | undefined>;

/**
 * Function returning a process.env-like {@link PEnvProcessEnv} object
 */
export type PEnvProcessEnvLoader = () => PEnvProcessEnv;

/**
 * Load the global variable process.env in an
 * [isomorphic](https://en.wikipedia.org/wiki/Isomorphic_JavaScript), type-safe
 * way defaulting to an empty object `{}`
 */
export function pEnvProcessEnvLoader(): PEnvProcessEnv {
	/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
	return (globalThis as any).process?.env || {};
}
