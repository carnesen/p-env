import { p } from '..';
import { NODE_ENV_PRODUCTION } from '../p-env-type';

describe('non-optional number', () => {
	const type = p.number({ default: 5 });

	it('returns the default value when NODE_ENV is not "production" and no value is present in the environment', () => {
		const parsed = type.parse(undefined, { NODE_ENV: undefined });
		expect(parsed).toBe(5);
	});

	it('returns the environment value if one is provided', () => {
		const parsed = type.parse('6');
		expect(parsed).toBe(6);
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
