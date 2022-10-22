/* eslint-disable no-console */
import { p } from '.';

class AppEnv extends p.env({
	APP: p.string({ default: 'my-app', optional: true }),
	DATA: p.json({ default: [] }),
	MODE: p.stringOneOf({
		default: 'dev',
		values: ['dev', 'qa', 'prod'] as const,
	}),
	PORT: p.port({ default: 8080 }),
	SECRET: p.string({ default: 'abc123', secret: true }),
	STRICT: p.boolean({ default: false, optional: true }),
}) {}

// The AppEnv constructor parses `process.env` and assigns the
// parsed values to the new instance. Suppose STRICT is
// set to "1" (or "yes" or "true") in the process environment.

const appEnv = new AppEnv({ logger: console });
// APP="my-app" (default)
// DATA=[] (default)
// MODE="dev" (default)
// PORT=8080 (default)
// SECRET=<redacted> (default)
// STRICT=true ("1")

// ^^ Parsed values for fields with `secret: true` are redacted in logs and
// error messages

// ^^ A log with (default) means a default value was used. Otherwise the logged
// line has ("<raw value>") where <raw value> is the string value from the
// process environment.

console.log(appEnv);
// AppEnv {
//   APP: 'my-app',
//   MODE: 'dev'
//   PORT: 10000,
//   SECRET: 'abc123',
//   STRICT: true
// }
