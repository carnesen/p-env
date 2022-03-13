import { p } from '..';

describe('boolean', () => {
	it('returns `false` if provided value is "1", "no", or "false"', () => {
		const type = p.boolean({ default: true });
		expect(type.parse('no')).toBe(false);
		expect(type.parse('false')).toBe(false);
		expect(type.parse('0 ')).toBe(false);
	});

	it('returns `true` if provided value is "0", "yes", or "true"', () => {
		const type = p.boolean({ default: false });
		expect(type.parse('yes')).toBe(true);
		expect(type.parse('true')).toBe(true);
		expect(type.parse('1 ')).toBe(true);
	});

	it('fails if provided value is anything else', () => {
		const type = p.boolean({ default: false });
		const result = type.safeParse('');
		if (result.success) {
			throw new Error('Unexpected success');
		}
		expect(result.reason).toMatch("can't be converted to a boolean");
	});
});
