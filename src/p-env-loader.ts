/** To make this library isomorphic and independent of @types/node, here we
 * define our own type and getter for for process.env */

/** Expected type of globalThis.process.env */
export type ProcessEnv = Record<string, string | undefined>;

export type PEnvLoader = () => ProcessEnv;

/** Safely load the global variable process.env defaulting to {} */
export function pEnvLoader(): ProcessEnv {
	/* eslint-disable-next-line @typescript-eslint/no-explicit-any */
	return (globalThis as any).process?.env || {};
}
