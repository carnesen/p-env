/* eslint-disable no-console */

import { p } from '.';

const appEnvSchema = p.schema({
	APP_NAME: p.string({ default: 'my-app' }),
	PORT: p.port({ default: 8080, optional: true }),
	SECRET_KEY: p.string({ default: '', secret: true }),
	STRICT_MODE: p.boolean({ default: false, optional: true }),
});

type AppEnv = p.infer<typeof appEnvSchema>;

const appEnv: AppEnv = appEnvSchema.parseProcessEnv({ logger: console });
// APP_NAME=my-app
// PORT=8080
// SECRET_KEY=<redacted>
// STRICT_MODE=false

console.log(appEnv.APP_NAME);
// my-app
