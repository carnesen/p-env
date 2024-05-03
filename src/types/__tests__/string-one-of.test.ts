import { p } from '../..';
import { PEnvError } from '../../p-env-error';
import { pEnvSuccess } from '../../p-env-result';

describe('non-optional string', () => {
	const field = p.stringOneOf({
		default: 'foo',
		values: ['foo', 'bar'],
	});

	it('returns the environment value if it is one of the allowed values', () => {
		const parsed = field.safeParse('bar');
		expect(parsed).toEqual(pEnvSuccess('bar'));
	});

	it('returns a failure result if the provided value is not one of the allowed ones', () => {
		const result = field.safeParse('chris');
		if (result.success) {
			throw new Error('Expected safeParse to fail');
		}
		expect(result.reason).toMatch(
			'is not one of the allowed values: "foo", "bar"',
		);
	});

	it('shows the redacted value only if secret', () => {
		const secret = p.stringOneOf({
			default: 'foo',
			values: ['foo', 'bar'] as const,
			secret: true,
		});
		const result = secret.safeParse('chris');
		if (result.success) {
			throw new Error('Expected safeParse to fail');
		}
		expect(result.reason).not.toMatch('foo');
	});

	it('factory throws if config.default is not an allowed value', () => {
		const func = () =>
			p.stringOneOf({ default: 'bar' as 'foo', values: ['foo'] });
		expect(func).toThrow(PEnvError);
		expect(func).toThrow('not one of the allowed values');
	});

	it('factory throws if config.values value has whitespace', () => {
		const func = () => p.stringOneOf({ default: 'foo ', values: ['foo '] });
		expect(func).toThrow(PEnvError);
		expect(func).toThrow('has leading or trailing whitespace');
	});
});
