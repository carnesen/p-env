/* eslint-disable no-console */

import { p } from '.';

class AppEnv extends p.env({
	APP_NAME: p.string({ default: 'my-app' }),
	PORT: p.port({ default: 8080, optional: true }),
	SECRET_KEY: p.string({ default: 'abc123', secret: true }),
	STRICT_MODE: p.boolean({ default: false, optional: true }),
}) {}

// The AppEnv constructor parses process.env and assigns the parsed values to
// the new instance. Suppose PORT is set to 10000 in process.env.
const appEnv = new AppEnv({ logger: console });
// APP_NAME=my-app
// PORT=10000
// SECRET_KEY=<redacted>
// STRICT_MODE=false

console.log(appEnv);
// AppEnv {
//   APP_NAME: 'my-app',
//   PORT: 10000,
//   SECRET_KEY: 'abc123',
//   STRICT_MODE: false
// }
