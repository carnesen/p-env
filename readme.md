[![build status badge](https://github.com/carnesen/p-env/workflows/test/badge.svg)](https://github.com/carnesen/p-env/actions?query=workflow%3Atest+branch%3Amaster)

An isomorphic TypeScript library for parsing `process.env` type-safely

## Usage

Install this package as a dependency in your library or application:
```shell
npm install @carnesen/p-env
```

Use it in your code like so:

```TypeScript
import { p } from '@carnesen/p-env';

class AppEnv extends p.env({
  APP_NAME: p.string({ default: 'my-app', optional: true }),
  PORT: p.port({ default: 8080 }),
  SECRET_KEY: p.string({ default: 'abc123', secret: true }),
  STRICT_MODE: p.boolean({ default: false, optional: true }),
}) {}

// The AppEnv constructor parses `process.env` and assigns the parsed values to the new instance. Suppose PORT is set to 10000 in the process environment.
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
```

Every field in the schema must have a default value. When `NODE_ENV` _is not_ `"production"` the default value will be used if a value is not provided in the process environment. When `NODE_ENV` _is_ `"production"`, the default value is ignored unless that field has `optional: true`. If a non-optional value is not present, a `PEnvError` is thrown.

## API

This primary documentation for this package's API is its rich, strict types along with their associated TypeDoc strings viewable in your IDE by hovering over a symbol. All exports are named. The primary export is the `p` namespace object.

### Schema

`p.env`: Takes a single argument defining the shape of your schema. Returns a abstract class that you should extend as a named class e.g. `class MyEnv extends p.env({})`. The named class's constructor parses `process.env` and assigns the parsed values to the new instance. The named class's constructor takes an optional `config` object argument. If `config.logger.log` is provided, the parsed values will be logged, suitable redacted for fields with `secret: true`. If `logger.error` is provided, all parsing/validation errors will be logged before the final `PEnvError` is thrown. The constructor's `config.loader` can be used to provide a custom `process.env` to the parser.


### Types

All type factories (`p.boolean` ...) take a `config` object argument with a single mandatory property `default`. As described above, the parser behaves differently based on the value of `NODE_ENV` in the process environment. When `NODE_ENV` is _not_ `"production"`, the `default` value is used for a field that is not provided in the process environment. When `NODE_ENV` _is_ `"production"`, the parser throws if a value is not provided unless the field has `optional: true`.

#### Boolean

`p.boolean`: Factory for `boolean`-valued environment variables. "1", "true", "yes" (and their upper-case/white-spaced variations) parse to `true`. "0", "false", and "no" and their upper-case/white-spaced variations) parse to `false`.

#### Number

There are three factories for `number` valued environment variables

`p.number`: Parses the environment value as a `number` by trimming the string value and calling `Number` on it. `NaN` is not considered a valid value. Has optional configuration properties `maximum` (default `+Infinity`) and `minimum` (default `-Infinity`) defining the allowed range for the the `number` value. 

`p.integer`: Same as `p.number` but with an additional validation that the parsed `number` value must be an integer. Equivalent to `p.number` with `{ integer: true }`.

`p.port`: Same as `p.integer` with `minimum: 0` and `maximum: 65535` 

#### String

`p.string`: Factory for `string`-valued environment variables. The `string` parser returns the environment value as-is.

### String array

`p.stringArray`: Factory for `string[]`-valued environment variables. The `stringArray` parser splits the environment value on `,`. 

#### Custom types

To create your own custom field type, extend `PEnvAbstractType` using the built-in classes (`PEnvBoolean` etc.) as your guide.

## Related

- [@carnesen/cli](https://github.com/carnesen/cli): A library for building command-line interfaces in Node.js and the browser

## License

MIT © [Chris Arnesen](https://www.carnesen.com)
