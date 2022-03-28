import { p } from '../..';
import { pEnvSuccess } from '../../result';

describe('boolean', () => {
	it('returns `false` if provided value is "1", "no", or "false"', () => {
		const type = p.boolean({ default: true });
		expect(type.safeParse('no')).toEqual(pEnvSuccess(false));
		expect(type.safeParse('false')).toEqual(pEnvSuccess(false));
		expect(type.safeParse('0 ')).toEqual(pEnvSuccess(false));
	});

	it('returns `true` if provided value is "0", "yes", or "true"', () => {
		const type = p.boolean({ default: false });
		expect(type.safeParse('yes')).toEqual(pEnvSuccess(true));
		expect(type.safeParse('true')).toEqual(pEnvSuccess(true));
		expect(type.safeParse('1 ')).toEqual(pEnvSuccess(true));
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
