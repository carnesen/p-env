import { p } from '..';
import { PEnvError } from '../p-env-error';
import { NODE_ENV_PRODUCTION } from '../p-env-abstract-type';
import { safeParseSuccess } from '../safe-parse-result';

describe('schema', () => {
	const schema = p.schema({
		NUMBER: p.number({ default: 5 }),
		STRING: p.string({ default: 'foo', maxLength: 3 }),
	});

	const { shape } = schema;

	it('returns an object of the correct shape and content', () => {
		const parsed = p.schema(shape).parseProcessEnv();
		expect(parsed).toEqual({ NUMBER: 5, STRING: 'foo' });
	});

	it('returns a failure result with all the reasons', () => {
		const result = p
			.schema(shape)
			.setLoader(() => ({ NODE_ENV: NODE_ENV_PRODUCTION }))
			.safeParseProcessEnv();
		if (result.success) {
			throw new Error('Expected safeParse to fail');
		}
		expect(result.reason).toMatch('NUMBER must be provided');
		expect(result.reason).toMatch('STRING must be provided');
	});

	it('parse loads actual process.env if default loader is used', () => {
		process.env.SOME_VALUE = 'foo';
		expect(
			p
				.schema({ SOME_VALUE: p.string({ default: 'bar' }) })
				.safeParseProcessEnv(),
		).toEqual(safeParseSuccess({ SOME_VALUE: 'foo' }));
	});

	it('parse throws all validation error if there are any', () => {
		const func = () =>
			p
				.schema(shape)
				.setLoader(() => ({ NUMBER: 'foo', STRING: 'foo bar baz' }))
				.parseProcessEnv();
		expect(func).toThrow(PEnvError);
		expect(func).toThrow("can't be converted to a number");
		expect(func).toThrow('longer than maxLength');
	});

	it('logs if a logger is provided', () => {
		const logger = {
			error: jest.fn(),
			log: jest.fn(),
		};
		p.schema(shape)
			.setLogger(logger)
			.setLoader(() => ({
				NUMBER: '3',
				STRING: 'foo bar baz',
			}))
			.safeParseProcessEnv();
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
		p.schema(shape)
			.setLogger(logger)
			.setLoader(() => ({
				NUMBER: '3',
				STRING: 'foo bar baz',
			}))
			.safeParseProcessEnv();
		expect(logger.error.mock.calls).toEqual([
			['STRING value "foo bar baz" is longer than maxLength=3'],
		]);
		expect(logger.log.mock.calls).toEqual([['NUMBER=3']]);
	});

	it('obfuscates the value if the name contains "secret"', () => {
		const logger = {
			log: jest.fn(),
		};
		p.schema({ SECRET_KEY: p.string({ default: '' }) })
			.setLogger(logger)
			.safeParseProcessEnv();
		expect(logger.log.mock.calls).toEqual([['SECRET_KEY=xxxxxxx']]);
	});
});
