import { p } from '../..';
import { PEnvError } from '../../error';
import { pEnvSuccess } from '../../result';

describe('non-optional string', () => {
	const type = p.string({ default: 'bar', maxLength: 3 });

	it('returns the environment value if one is provided', () => {
		const parsed = type.safeParse('baz');
		expect(parsed).toEqual(pEnvSuccess('baz'));
	});

	it('returns a failure result if value provided is greater than maxLength', () => {
		const result = type.safeParse('chris');
		if (result.success) {
			throw new Error('Expected safeParse to fail');
		}
		expect(result.reason).toMatch('is longer than maxLength=3');
	});

	it('factory throws if config.maxLength is negative', () => {
		const func = () => p.string({ default: '', maxLength: -1 });
		expect(func).toThrow(PEnvError);
		expect(func).toThrow('maxLength must be non-negative');
	});

	it('factory throws if config.default is longer than config.maxLength', () => {
		const func = () => p.string({ default: 'foo', maxLength: 2 });
		expect(func).toThrow(PEnvError);
		expect(func).toThrow('longer than maxLength');
	});
});
