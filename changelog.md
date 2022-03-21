# **@carnesen/p-env** changelog

## Upcoming

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
