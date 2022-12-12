import { p } from '../..';
import { pEnvSuccess } from '../../result';

describe('date', () => {
	it('returns a `new Date` constructed with the provided string', () => {
		const defaultDate = new Date(123);
		const anotherDate = new Date(321);
		const type = p.date({ default: defaultDate });
		expect(type.safeParse(anotherDate.toISOString())).toEqual(
			pEnvSuccess(anotherDate),
		);
	});

	it('fails if provided value is anything else', () => {
		const defaultDate = new Date(123);
		const type = p.date({ default: defaultDate });
		const result = type.safeParse('');
		if (result.success) {
			throw new Error('Unexpected success');
		}
		expect(result.reason).toMatch("can't be converted to a date");
	});
});
