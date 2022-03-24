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
```

Every field in the schema must have a default value. When `NODE_ENV` _is not_ `"production"` the default value will be used if a value is not provided in the process environment. When `NODE_ENV` _is_ `"production"`, the default value is ignored unless that field has `optional: true`.

The schema `safeParseProcessEnv` method returns `{ success: true, value: <the parsed process.env>}` if there are no validation/parse errors or `{ success: false, reason: <validation/parse error messages>}` otherwise. The schema `parseProcessEnv` method returns the parsed result value or throws if there's a validation/parse error.

## API

This primary documentation for this package's API is its rich, strict types along with their associated TypeDoc strings viewable in your IDE by hovering over a symbol. All exports are named. The primary export is the `p` namespace object. To create your own custom field type, extend `PEnvAbstractType`.

## Related

- [@carnesen/cli](https://github.com/carnesen/cli): A library for building command-line interfaces in Node.js and the browser

## License

MIT © [Chris Arnesen](https://www.carnesen.com)
