import { p } from '../..';
import { pEnvSuccess } from '../../result';

describe('boolean', () => {
	it('parses the provided number as a bigint', () => {
		const type = p.bigint({ default: 0n });
		expect(type.safeParse('1')).toEqual(pEnvSuccess(1n));
		expect(type.safeParse('1 ')).toEqual(pEnvSuccess(1n));
	});

	it('fails if provided value is empty', () => {
		const type = p.bigint({ default: 0n });
		const result = type.safeParse('');
		if (result.success) {
			throw new Error('Unexpected success');
		}
		expect(result.reason).toMatch(
			'unwilling to convert empty string to bigint',
		);
	});
	it('fails if provided value is invalid', () => {
		const type = p.bigint({ default: 0n });
		const result = type.safeParse('asdf');
		if (result.success) {
			throw new Error('Unexpected success');
		}
		expect(result.reason).toMatch('Cannot convert asdf to a BigInt');
	});
});
