[![build status badge](https://github.com/carnesen/p-env/workflows/test/badge.svg)](https://github.com/carnesen/p-env/actions?query=workflow%3Atest+branch%3Amaster)

An isomorphic TypeScript library for parsing process.env type-safely

## Usage

Install this package as a dependency in your library or application:
```shell
npm install @carnesen/p-env
```

Example usage:

```TypeScript
import { p } from '@carnesen/p-env';

const appEnvSchema = p.schema({
	APP_NAME: p.string({ default: 'my-app' }),
	PORT: p.port({ default: 8080, optional: true }),
	STRICT_MODE: p.boolean({ default: false, optional: true }),
});

type AppEnv = p.infer<typeof appEnvSchema>;

const appEnv: AppEnv = appEnvSchema.parseProcessEnv();

console.log(appEnv.APP_NAME); // "my-app"
```

The default value will be used if no value is present for this variable in the process environment and if NODE_ENV is not set to "production" in the process environment. When NODE_ENV _is_ set to "production", `parseProcessEnv` throws if no value for a variable is present in the process environment unless that variable is configured with `optional: true` in which case the default value is used.

## Related

- [@carnesen/cli](https://github.com/carnesen/cli): A library for building command-line interfaces in Node.js and the browser

## License

MIT © [Chris Arnesen](https://www.carnesen.com)
