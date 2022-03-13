import { p } from '..';
import { NODE_ENV_PRODUCTION } from '../p-env-type';

describe('schema', () => {
	const schema = p.schema({
		NUMBER: p.number({ default: 5 }),
		STRING: p.string({ default: 'foo' }),
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
});
