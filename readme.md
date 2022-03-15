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

const appEnvSchema = p
  .schema({
    APP_NAME: p.string({ default: 'my-app' }),
    PORT: p.port({ default: 8080, optional: true }),
    SECRET_KEY: p.string({ default: '' }),
    STRICT_MODE: p.boolean({ default: false, optional: true }),
  })
  .setLogger(console);

type AppEnv = p.infer<typeof appEnvSchema>;

const appEnv: AppEnv = appEnvSchema.parseProcessEnv();
// APP_NAME=my-app
// PORT=8080
// SECRET_KEY=xxxxxxx
// STRICT_MODE=false

console.log(appEnv.APP_NAME);
// my-app
```

The default value must be provided and will be used for a variable if it's not set in the process environment and if NODE_ENV is not "production". When NODE_ENV is "production", the default value is ignored unless the variable has `optional: true`. Said another way, when NODE_ENV is "production" environment variables are mandatory by default. The schema `safeParseProcessEnv` method returns `{ success: true, value: <the parsed process.env>}` if there are no validation/parse errors or `{ success: false, reason: <validation/parse error messages>}` otherwise. The schema `parseProcessEnv` method returns the parsed result value or throws if there's a validation/parse error.

## Related

- [@carnesen/cli](https://github.com/carnesen/cli): A library for building command-line interfaces in Node.js and the browser

## License

MIT © [Chris Arnesen](https://www.carnesen.com)
