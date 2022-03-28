[![build status badge](https://github.com/carnesen/p-env/workflows/test/badge.svg)](https://github.com/carnesen/p-env/actions?query=workflow%3Atest+branch%3Amaster)

An isomorphic TypeScript library for parsing `process.env` type-safely

## Usage

Install this package as a dependency in your library or application:
```shell
npm install @carnesen/p-env
```

Here's an example of how to use it in your code:

```TypeScript
import { p } from '@carnesen/p-env';

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
```

## `default` and `optional`

Every field in the schema must have a `default` value. A environment value always takes precedence over the `default` value. If an environment value is not provided, two factors determine whether the `default` value is used: 
- Is Node.js is running in [development or production mode](https://nodejs.dev/learn/nodejs-the-difference-between-development-and-production)?
- Does the field have `optional` set to `true`?

| optional | mode        | use default? | 
| :------: | :---------: | :----------: |
| true     | any         | yes          |
| any      | development | yes          |
| false    | production  | no           |

When `NODE_ENV` is `"production"` and no environment value is provided for a non-optional field, the parser throws a `PEnvError`.

## API

This primary documentation for this package's API is its rich, strict types along with their associated TypeDoc strings viewable in your IDE by hovering over a symbol. All exports are named. The primary export is the `p` namespace object `import { p } from "@carnesen/p-env"`.

### Env

`p.env`: Takes a single argument defining your environment object's schema and returns a abstract class that you should extend as a named class e.g. `class MyEnv extends p.env({})`. The named class's constructor parses `process.env` and assigns the parsed values to the new instance. The named class's constructor takes an optional `config` object argument `new MyEnv({ logger, loader }).` If `logger.log` is provided, the parsed values are logged. If `logger.error` is provided, parse/validation errors are logged. Use the `loader` property to define a custom `process.env` loader. This is mostly useful for unit testing.

### Type configuration

All type factories (`p.boolean` etc.) take a `config` object argument with a single mandatory property `default` and optional properties `optional` and `secret`. The meaning of `optional` is described above. If `secret` is true, the field value is redacted in logs and error messages. Some of the field types have other optional properties too.

### Boolean

`p.boolean`: Factory for `boolean`-valued environment variables. "1", "true", "yes" (and their upper-case/white-spaced variations) parse to `true`. "0", "false", and "no" and their upper-case/white-spaced variations) parse to `false`.

### Number

There are three factories for `number` valued environment variables

`p.number`: Parses the environment value as a `number`. `NaN` is not allowed value. Has optional configuration properties `maximum` (default `+Infinity`) and `minimum` (default `-Infinity`) defining the allowed range for the `number` value. 

`p.integer`: Same as `p.number` but the parsed `number` must be an integer. Equivalent to `p.number` with `{ integer: true }`.

`p.port`: Same as `p.integer` with `minimum: 0` and `maximum: 65535`. Optional config properties `maximum` and `minimum` further restrict the allowed range.

### String

`p.string`: Factory for `string`-valued environment variables. The `string` parser returns the environment value as-is.

### String array

`p.stringArray`: Factory for `string[]`-valued environment variables. The `stringArray` parser splits the environment value on `,`. 

### Custom types

To create your own custom field type, extend `PEnvAbstractType` using the built-in classes (`PEnvBoolean` etc.) as your guide.

## More information

If you encounter any bugs or have any questions or feature requests, please don't hesitate to file an issue or submit a pull request on [this project's repository on GitHub](https://github.com/carnesen/p-env).

## Related

- [@carnesen/cli](https://github.com/carnesen/cli): A library for building command-line interfaces in Node.js and the browser

## License

MIT © [Chris Arnesen](https://www.carnesen.com)
