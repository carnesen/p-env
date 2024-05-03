# **@carnesen/p-env** changelog

## Upcoming

Node.js support: 
- Dropped: 14, 16
- Maintenance: 18
- Active: 20
- Current: 22

Feature: Add types numberArray and stringOneOfArray

## carnesen-p-env-0.11.0 (2023-02-18)

Feature: Allow config to be provided as `p.env(schema, config)`. Previously config was only providable at instantiation `new MyEnv(config)`. Now if both are provided they are shallow merged with instance config taking priority.

Feature: Export a PEnvBase base class from which all p.env classes descend. This allows us to do prototype-based sanity checks like `MyEnv.prototype instanceof PEnvBase` and `myEnv instanceof PEnvBase` in advanced use cases.

Advanced breaking: Simplify the names of several advanced types e.g. PEnvEnvConfig --> PEnvConfig, PEnvAbstractEnv --> PEnv. This is only breaking if you're using these advanced types directly in your code.

Internal: Add official support for Node.js 18, 19. Upgrade dependencies.

## carnesen-p-env-0.10.0 (2022-12-12)

Feature: Field factory `p.date` for parsing environment variables as `Date`

## carnesen-p-env-0.9.0 (2022-11-06)

Feature: Field factory `p.bigint` for parsing environment variables as `bigint`

## carnesen-p-env-0.8.0 (2022-10-22)

Feature: Field factory `p.json` for parsing environment variable values as JSON

## carnesen-p-env-0.7.0 (2022-10-21)

Feature: "string one of" field type where the value in the environment must be one of the allowed values

## carnesen-p-env-0.6.0 (2022-03-27)

Breaking: Rename `PEnvAbstractType` -> `PEnvAbstractFieldType`. This is only a breaking change if you've defined custom types.

Fix: Make abstract the class returned by pEnvAbstractEnvFactory

## carnesen-p-env-0.5.1 (2022-03-26)

Fix: Remove @carnesen/p-dev as dependency. How'd that get in there?

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
