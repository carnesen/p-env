# **@carnesen/p-env** changelog

## Upcoming

## carnesen-p-env-0.5.0 (2022-03-26)

Breaking: Adopt a class-based schema interface and discard the POJO one.

```TypeScript
// Was
const appEnvSchema = p.schema({ FOO: p.string({ default: "bar" }) });
const appEnv = schema.parse();

// Is
const AppEnv = p.env({ FOO: p.string({ default: "bar" }) });
const appEnv = new AppEnv();
```

This makes it easier to use p-env with dependency injection frameworks.

Breaking: Change PEnvAbstractType interface to only have a single public method safeParse (was protected and called safeParseInternal). This is only a breaking change if you've implemented your own custom concrete types or if you were using the individual field "parse" method.

## carnesen-p-env-0.4.0 (2022-03-24)

Breaking: Change PEnvAbstractType method name from _safeParse to safeParseInternal. This is only a breaking change if you're using a custom PEnvAbstractType subclass.

Fix: Redact environment value in error messages and logs if the type has `config.secret === true`.

## carnesen-p-env-0.3.0 (2022-03-20)

Breaking: Tweak the logger API one more time for real. Now it's e.g. 
```TypeScript
const schema = p.schema(shape, { logger });
const env = schema.parseProcessEnv();
// OR
const schema = p.schema(shape);
const env = schema.parseProcessEnv({ logger })
```

## carnesen-p-env-0.2.0 (2022-03-14)

Breaking: Tweak logger API one more time. Now it's e.g.:
```TypeScript
const schema = p.schema({}).setLogger(console)
```

## carnesen-p-env-0.1.0 (2022-03-13)

Feature: Support comma-separated `string[]`-valued variables as `p.stringArray`

Feature: Support for logging environment variables in PEnvSchema#parseProcessEnv

Breaking: Change argument of PEnvSchema#parseProcessEnv from [processEnv] to [{log, processEnv}]

## carnesen-p-env-0.0.0 (2022-03-13)

Initial release with schema support for boolean, number, and string fields.
