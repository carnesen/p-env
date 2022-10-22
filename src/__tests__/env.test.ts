import { p } from '..';
import { NODE_ENV_PRODUCTION } from '../abstract-env';
import { PEnvError } from '../error';

describe('p.env', () => {
	class TestEnv extends p.env({
		NUMBER: p.number({ default: 5 }),
		STRING: p.string({ default: 'foo', maxLength: 3 }),
	}) {}

	class SecretEnv extends p.env({
		SECRET: p.string({ default: 'abc123', secret: true }),
	}) {}

	it('can be instantiated with a config object', () => {
		const logger = { log: jest.fn() };
		const _env = new TestEnv({ logger });
		expect(logger.log).toHaveBeenCalled();
	});

	it('returns an object of the correct schema and content', () => {
		const env = new TestEnv();
		expect(env).toEqual({ NUMBER: 5, STRING: 'foo' });
	});

	it('throws an PEnvError result with all the reasons', () => {
		const func = () =>
			new TestEnv({
				loader: () => ({ NODE_ENV: NODE_ENV_PRODUCTION }),
			});
		expect(func).toThrow('NUMBER is not optional');
		expect(func).toThrow('STRING is not optional');
		expect(func).toThrow(PEnvError);
	});

	it('parse loads actual process.env if default loader is used', () => {
		process.env.STRING = 'xyz';
		expect(new TestEnv()).toEqual({ NUMBER: 5, STRING: 'xyz' });
		delete process.env.STRING;
	});

	it('parse throws all validation errors if there are any', () => {
		const func = () =>
			new TestEnv({
				loader: () => ({ NUMBER: 'foo', STRING: 'foo bar baz' }),
			});
		expect(func).toThrow(PEnvError);
		expect(func).toThrow("can't be converted to a number");
		expect(func).toThrow('longer than maxLength');
	});

	it('calls logger.log and logger.error if both are provided', () => {
		const logger = {
			error: jest.fn(),
			log: jest.fn(),
		};
		const loader = () => ({
			NUMBER: '3',
			STRING: 'foo bar baz',
		});
		const func = () => new TestEnv({ logger, loader });
		expect(func).toThrow();
		expect(logger.error.mock.calls).toEqual([
			['STRING value "foo bar baz" is longer than maxLength=3'],
		]);
		expect(logger.log.mock.calls).toEqual([['NUMBER=3 ("3")']]);
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
		const func = () => new TestEnv({ logger, loader });
		expect(func).toThrow();
		expect(logger.error.mock.calls).toEqual([
			['STRING value "foo bar baz" is longer than maxLength=3'],
		]);
		expect(logger.log.mock.calls).toEqual([['NUMBER=3 ("3")']]);
	});

	it('redacts the logged value when an environment value is used and secret=true', () => {
		const logger = {
			log: jest.fn(),
		};
		const _env = new SecretEnv({
			logger,
			loader: () => ({ SECRET: 'foobar' }),
		});
		expect(logger.log.mock.calls[0][0]).toMatch('SECRET=');
		expect(logger.log.mock.calls[0][0]).not.toMatch('foobar');
	});

	it('redacts the logged value when the default value is used and secret=true', () => {
		const logger = {
			log: jest.fn(),
		};
		const _env = new SecretEnv({
			logger,
		});
		expect(logger.log.mock.calls[0][0]).toMatch('SECRET=');
		expect(logger.log.mock.calls[0][0]).toMatch('(default)');
		expect(logger.log.mock.calls[0][0]).not.toMatch('abc123');
	});

	it('redacts the environment value on error if the type config has secret=true', () => {
		const logger = {
			log: jest.fn(),
			error: jest.fn(),
		};
		class AnotherSecretEnv extends p.env({
			SECRET_NUMBER: p.number({ default: 0, secret: true, maximum: 1 }),
		}) {}
		const func = () =>
			new AnotherSecretEnv({ logger, loader: () => ({ SECRET_NUMBER: '2' }) });
		expect(func).toThrow(/^[^2]*$/);
		expect(logger.error.mock.calls[0][0]).toMatch('SECRET_NUMBER');
		expect(logger.error.mock.calls[0][0]).not.toMatch('2');
	});
});
