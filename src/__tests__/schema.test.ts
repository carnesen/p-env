import { p } from '..';
import { PEnvError } from '../p-env-error';
import { NODE_ENV_PRODUCTION } from '../p-env-abstract-type';
import { safeParseSuccess } from '../safe-parse-result';

describe('schema', () => {
	const schema = p.schema({
		NUMBER: p.number({ default: 5 }),
		STRING: p.string({ default: 'foo', maxLength: 3 }),
	});

	it('returns an object of the correct shape and content', () => {
		const parsed = schema.parseProcessEnv(undefined);
		expect(parsed).toEqual({ NUMBER: 5, STRING: 'foo' });
	});

	it('returns a failure result with all the reasons', () => {
		const result = schema.safeParseProcessEnv({
			processEnv: {
				NODE_ENV: NODE_ENV_PRODUCTION,
			},
		});
		if (result.success) {
			throw new Error('Expected safeParse to fail');
		}
		expect(result.reason).toMatch('NUMBER must be provided');
		expect(result.reason).toMatch('STRING must be provided');
	});

	it('parse loads process.env if none is provided', () => {
		expect(
			p
				.schema({ NODE_ENV: p.string({ default: 'development' }) })
				.safeParseProcessEnv(),
		).toEqual(safeParseSuccess({ NODE_ENV: 'test' }));
	});

	it('parse throws all validation error if there are any', () => {
		const func = () =>
			schema.parseProcessEnv({
				processEnv: { NUMBER: 'foo', STRING: 'foo bar baz' },
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
		schema.safeParseProcessEnv({
			logger,
			processEnv: {
				NUMBER: '3',
				STRING: 'foo bar baz',
			},
		});
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
		schema.safeParseProcessEnv({
			logger,
			processEnv: {
				NUMBER: '3',
				STRING: 'foo bar baz',
			},
		});
		expect(logger.error.mock.calls).toEqual([
			['STRING value "foo bar baz" is longer than maxLength=3'],
		]);
		expect(logger.log.mock.calls).toEqual([['NUMBER=3']]);
	});

	it('obfuscates the value if the name contains "secret"', () => {
		const logger = {
			log: jest.fn(),
		};
		p.schema({ SECRET_KEY: p.string({ default: '' }) }).safeParseProcessEnv({
			logger,
		});
		expect(logger.log.mock.calls).toEqual([['SECRET_KEY=xxxxxxx']]);
	});
});
