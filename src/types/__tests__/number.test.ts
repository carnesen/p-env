import { p } from '../..';
import { PEnvError } from '../../p-env-error';
import { pEnvSuccess } from '../../p-env-result';

describe('number', () => {
	const type = p.number({ default: 5, minimum: 0, maximum: 10, integer: true });

	it('returns the provided value as a number', () => {
		expect(type.safeParse('6')).toEqual(pEnvSuccess(6));
	});

	it('returns a failure result if a value less than minimum is provided', () => {
		const result = type.safeParse('-1');
		if (result.success) {
			throw new Error('Expected safeParse to fail');
		}
		expect(result.reason).toMatch('is less than the minimum 0');
	});

	it('returns a failure result if a value greater than maximum is provided', () => {
		const result = type.safeParse('11');
		if (result.success) {
			throw new Error('Expected safeParse to fail');
		}
		expect(result.reason).toMatch('is greater than the maximum 10');
	});

	it('returns a failure result if an empty string is provided', () => {
		const result = type.safeParse('');
		if (result.success) {
			throw new Error('Expected safeParse to fail');
		}
		expect(result.reason).toMatch("can't be converted");
	});

	it('returns a failure result if an empty string is provided', () => {
		const result = type.safeParse('');
		if (result.success) {
			throw new Error('Expected safeParse to fail');
		}
		expect(result.reason).toMatch("can't be converted");
	});

	it('returns a failure result if a non-numeric string is provided', () => {
		const result = type.safeParse('foo');
		if (result.success) {
			throw new Error('Expected safeParse to fail');
		}
		expect(result.reason).toMatch("can't be converted");
	});

	it('returns a failure result if a non-integer number is provided and integer is true', () => {
		const result = type.safeParse('0.5');
		if (result.success) {
			throw new Error('Expected safeParse to fail');
		}
		expect(result.reason).toMatch('is not an integer');
	});
});

describe('number misconfiguration', () => {
	it('throws if provided a default greater than than the maximum', () => {
		const func = () => p.number({ default: 2, maximum: 1 });
		expect(func).toThrow('greater than');
		expect(func).toThrow(PEnvError);
	});

	it('throws if provided a default less than the maximum', () => {
		const func = () => p.number({ default: 0, minimum: 1 });
		expect(func).toThrow('less than');
		expect(func).toThrow(PEnvError);
	});

	it('throws if provided a non-integer default when integer is true', () => {
		const func = () => p.number({ default: 0.5, integer: true });
		expect(func).toThrow('not an integer');
		expect(func).toThrow(PEnvError);
	});

	it('throws if provided a non-integer maximum when integer is true', () => {
		const func = () => p.number({ default: 1, maximum: 0.5, integer: true });
		expect(func).toThrow('not an integer');
		expect(func).toThrow(PEnvError);
	});

	it('throws if provided a non-integer minimum when integer is true', () => {
		const func = () => p.number({ default: 1, minimum: 0.5, integer: true });
		expect(func).toThrow('not an integer');
		expect(func).toThrow(PEnvError);
	});
});
