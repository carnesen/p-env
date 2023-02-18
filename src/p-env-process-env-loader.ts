/** To make this library isomorphic and independent of @types/node, here we
 * define our own type and getter for for process.env */

/** Expected type of globalThis.process.env */
export type PEnvProcessEnv = Record<string, string | undefined>;

export type PEnvProcessEnvLoader = () => PEnvProcessEnv;

/** Safely load the global variable process.env defaulting to {} */
export function pEnvProcessEnvLoader(): PEnvProcessEnv {
	/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
	return (globalThis as any).process?.env || {};
}
