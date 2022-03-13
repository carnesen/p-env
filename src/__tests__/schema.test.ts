import { p } from '..';
import { PEnvError } from '../p-env-error';
import { NODE_ENV_PRODUCTION } from '../p-env-type';
import { safeParseSuccess } from '../safe-parse-result';

describe('schema', () => {
	const schema = p.schema({
		NUMBER: p.number({ default: 5 }),
		STRING: p.string({ default: 'foo', maxLength: 3 }),
	});

	it('returns an object of the correct shape and content', () => {
		const parsed = schema.parse(undefined);
		expect(parsed).toEqual({ NUMBER: 5, STRING: 'foo' });
	});

	it('returns a failure result with all the reasons', () => {
		const result = schema.safeParse({
			NODE_ENV: NODE_ENV_PRODUCTION,
		});
		if (result.success) {
			throw new Error('Expected safeParse to fail');
		}
		expect(result.reason).toMatch('NUMBER must be provided');
		expect(result.reason).toMatch('STRING must be provided');
	});

	it('parse loads process.env if none is provided', () => {
		expect(
			p.schema({ NODE_ENV: p.string({ default: 'development' }) }).safeParse(),
		).toEqual(safeParseSuccess({ NODE_ENV: 'test' }));
	});

	it('parse throws all validation error if there are any', () => {
		const func = () => schema.parse({ NUMBER: 'foo', STRING: 'foo bar baz' });
		expect(func).toThrow(PEnvError);
		expect(func).toThrow("can't be converted to a number");
		expect(func).toThrow('longer than maxLength');
	});
});
