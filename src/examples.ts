/* eslint-disable no-console */

import { p } from '.';

class AppEnv extends p.env({
	APP_NAME: p.string({ default: 'my-app' }),
	PORT: p.port({ default: 8080, optional: true }),
	SECRET_KEY: p.string({ default: '', secret: true }),
	STRICT_MODE: p.boolean({ default: false, optional: true }),
}) {}

const appEnv = new AppEnv({ logger: console });
// APP_NAME=my-app
// PORT=8080
// SECRET_KEY=<redacted>
// STRICT_MODE=false

console.log(appEnv.APP_NAME);
// my-app
