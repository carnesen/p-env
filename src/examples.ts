/* eslint-disable no-console */
import { p } from '.';

class AppEnv extends p.env({
	APP_NAME: p.string({ default: 'my-app', optional: true }),
	PORT: p.port({ default: 8080 }),
	SECRET_KEY: p.string({ default: 'abc123', secret: true }),
	STRICT_MODE: p.boolean({ default: false, optional: true }),
}) {}

// The AppEnv constructor parses `process.env` and assigns the
// parsed values to the new instance. Suppose STRICT_MODE is
// set to "yes" (or "1" or "true") in the process environment.

const appEnv = new AppEnv({ logger: console });
// APP_NAME=my-app
// PORT=8080
// SECRET_KEY=<redacted>
// STRICT_MODE=true

// ^^ Fields with `secret: true` are redacted in logs and errors

console.log(appEnv);
// AppEnv {
//   APP_NAME: 'my-app',
//   PORT: 10000,
//   SECRET_KEY: 'abc123',
//   STRICT_MODE: true
// }
