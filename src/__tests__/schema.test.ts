import { p } from '..';
import { PEnvError } from '../p-env-error';
import { NODE_ENV_PRODUCTION } from '../p-env-abstract-type';
import { safeParseSuccess } from '../safe-parse-result';

describe('schema', () => {
	const schema = p.schema({
		NUMBER: p.number({ default: 5 }),
		STRING: p.string({ default: 'foo', maxLength: 3 }),
	});

	it('can be instantiated with a config object', () => {
		const logger = { log: jest.fn() };
		p.schema(schema.shape, { logger }).safeParseProcessEnv();
		expect(logger.log).toHaveBeenCalled();
	});

	it('can be provided with config object overrides for parsing', () => {
		const instanceConfig = { logger: { log: jest.fn() } };
		const safeParseConfig = { logger: { log: jest.fn() } };
		p.schema(schema.shape, instanceConfig).safeParseProcessEnv(safeParseConfig);
		expect(instanceConfig.logger.log).not.toHaveBeenCalled();
		expect(safeParseConfig.logger.log).toHaveBeenCalled();
	});

	it('returns an object of the correct shape and content', () => {
		const parsed = schema.parseProcessEnv();
		expect(parsed).toEqual({ NUMBER: 5, STRING: 'foo' });
	});

	it('returns a failure result with all the reasons', () => {
		const result = schema.safeParseProcessEnv({
			loader: () => ({ NODE_ENV: NODE_ENV_PRODUCTION }),
		});
		if (result.success) {
			throw new Error('Expected safeParse to fail');
		}
		expect(result.reason).toMatch('NUMBER must be provided');
		expect(result.reason).toMatch('STRING must be provided');
	});

	it('parse loads actual process.env if default loader is used', () => {
		process.env.STRING = 'xyz';
		expect(schema.safeParseProcessEnv()).toEqual(
			safeParseSuccess({ NUMBER: 5, STRING: 'xyz' }),
		);
		delete process.env.STRING;
	});

	it('parse throws all validation error if there are any', () => {
		const func = () =>
			schema.parseProcessEnv({
				loader: () => ({ NUMBER: 'foo', STRING: 'foo bar baz' }),
			});
		expect(func).toThrow(PEnvError);
		expect(func).toThrow("can't be converted to a number");
		expect(func).toThrow('longer than maxLength');
	});

	it('logs if a logger is provided', () => {
		const logger = {
			error: jest.fn(),
			log: jest.fn(),
		};
		const loader = () => ({
			NUMBER: '3',
			STRING: 'foo bar baz',
		});
		schema.safeParseProcessEnv({ logger, loader });
		expect(logger.error.mock.calls).toEqual([
			['STRING value "foo bar baz" is longer than maxLength=3'],
		]);
		expect(logger.log.mock.calls).toEqual([['NUMBER=3']]);
	});

	it('uses logger.log for errors if logger.error is not provided', () => {
		const logger = {
			error: jest.fn(),
			log: jest.fn(),
		};
		const loader = () => ({
			NUMBER: '3',
			STRING: 'foo bar baz',
		});
		schema.safeParseProcessEnv({ logger, loader });
		expect(logger.error.mock.calls).toEqual([
			['STRING value "foo bar baz" is longer than maxLength=3'],
		]);
		expect(logger.log.mock.calls).toEqual([['NUMBER=3']]);
	});

	it('obfuscates the logged value if the type config has secret=true', () => {
		const logger = {
			log: jest.fn(),
		};
		p.schema({
			SECRET_KEY: p.string({ default: 'abc123', secret: true }),
		}).safeParseProcessEnv({ logger });
		expect(logger.log.mock.calls[0][0]).toMatch('SECRET_KEY=');
		expect(logger.log.mock.calls[0][0]).not.toMatch('abc123');
	});

	it('obfuscates the environment value on error if the type config has secret=true', () => {
		const logger = {
			log: jest.fn(),
			error: jest.fn(),
		};
		const result = p
			.schema({
				SECRET_NUMBER: p.number({ default: 0, secret: true, maximum: 1 }),
			})
			.safeParseProcessEnv({ logger, loader: () => ({ SECRET_NUMBER: '2' }) });
		if (result.success) {
			throw new Error('Expected failure');
		}
		expect(result.reason).not.toMatch('2');
		expect(logger.error.mock.calls[0][0]).toMatch('SECRET_NUMBER');
		expect(logger.error.mock.calls[0][0]).not.toMatch('2');
	});
});
