import { p } from '..';
import { NODE_ENV_PRODUCTION } from '../p-env-type';

describe('non-optional string', () => {
	const type = p.string({ default: 'bar' });

	it('returns the default value when NODE_ENV is not "production" and no value is present in the environment', () => {
		const parsed = type.parse(undefined, { NODE_ENV: undefined });
		expect(parsed).toBe('bar');
	});

	it('returns the environment value if one is provided', () => {
		const parsed = type.parse('baz');
		expect(parsed).toBe('baz');
	});

	it('returns a failure result if NODE_ENV is "production" and no value is provided', () => {
		const result = type.safeParse(undefined, {
			NODE_ENV: NODE_ENV_PRODUCTION,
		});
		if (result.success) {
			throw new Error('Expected safeParse to fail');
		}
		expect(result.reason).toMatch('must be provided');
	});
});
