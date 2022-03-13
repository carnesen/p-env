import { p } from '.';

const appEnvSchema = p.schema({
	APP_NAME: p.string({ default: 'my-app' }),
	PORT: p.port({ default: 8080, optional: true }),
	STRICT_MODE: p.boolean({ default: false, optional: true }),
});

type AppEnv = p.infer<typeof appEnvSchema>;

const appEnv: AppEnv = appEnvSchema.parseProcessEnv();

/* eslint-disable-next-line no-console */
console.log(appEnv.APP_NAME); // "my-app"
