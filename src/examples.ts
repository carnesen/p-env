/* eslint-disable no-console */
import { p } from '.';

class AppEnv extends p.env({
	APP_NAME: p.string({ default: 'my-app', optional: true }),
	ENV: p.stringOneOf({
		default: 'dev',
		values: ['dev', 'qa', 'prod'] as const,
	}),
	PORT: p.port({ default: 8080 }),
	SECRET_KEY: p.string({ default: 'abc123', secret: true }),
	STRICT_MODE: p.boolean({ default: false, optional: true }),
}) {}

// The AppEnv constructor parses `process.env` and assigns the
// parsed values to the new instance. Suppose STRICT_MODE is
// set to "yes" (or "1" or "true") in the process environment.

const appEnv = new AppEnv({ logger: console });
// APP_NAME=my-app (default)
// ENV=dev (default)
// PORT=8080 (default)
// SECRET_KEY=<redacted> (default)
// STRICT_MODE=false (default)

// ^^ Parsed values for fields with `secret: true` are redacted in logs and
// error messages. A log line with "(default)" means a default value was used.

console.log(appEnv);
// AppEnv {
//   APP_NAME: 'my-app',
//   ENV: 'dev'
//   PORT: 10000,
//   SECRET_KEY: 'abc123',
//   STRICT_MODE: true
// }
