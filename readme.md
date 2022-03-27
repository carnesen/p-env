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
```

In the example above, the `AppEnv` constructor parses `process.env` and assigns the parsed values to the instance as `APP_NAME`, `PORT`, etc.

Every field in the schema must have a default value. When `NODE_ENV` _is not_ `"production"` the default value will be used if a value is not provided in the process environment. When `NODE_ENV` _is_ `"production"`, the default value is ignored unless that field has `optional: true`. If a non-optional value is not present, a `PEnvError` is thrown.

## API

This primary documentation for this package's API is its rich, strict types along with their associated TypeDoc strings viewable in your IDE by hovering over a symbol. All exports are named. The primary export is the `p` namespace object. To create your own custom field type, extend `PEnvAbstractType`.

## Related

- [@carnesen/cli](https://github.com/carnesen/cli): A library for building command-line interfaces in Node.js and the browser

## License

MIT © [Chris Arnesen](https://www.carnesen.com)
