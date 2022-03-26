import { p } from '..';
import { safeParseSuccess } from '../safe-parse-result';

describe('boolean', () => {
	it('returns `false` if provided value is "1", "no", or "false"', () => {
		const type = p.boolean({ default: true });
		expect(type.safeParse('no')).toEqual(safeParseSuccess(false));
		expect(type.safeParse('false')).toEqual(safeParseSuccess(false));
		expect(type.safeParse('0 ')).toEqual(safeParseSuccess(false));
	});

	it('returns `true` if provided value is "0", "yes", or "true"', () => {
		const type = p.boolean({ default: false });
		expect(type.safeParse('yes')).toEqual(safeParseSuccess(true));
		expect(type.safeParse('true')).toEqual(safeParseSuccess(true));
		expect(type.safeParse('1 ')).toEqual(safeParseSuccess(true));
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
