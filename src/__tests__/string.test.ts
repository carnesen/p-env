import { p } from '..';
import { PEnvError } from '../p-env-error';
import { NODE_ENV_PRODUCTION } from '../p-env-type';
import { safeParseSuccess } from '../safe-parse-result';

describe('non-optional string', () => {
	const type = p.string({ default: 'bar', maxLength: 3 });

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

	it('parse throws if validation fails', () => {
		const func = () => p.string({ default: '', maxLength: 2 }).parse('bar');
		expect(func).toThrow(PEnvError);
		expect(func).toThrow('longer than maxLength');
	});

	it('if optional, returns the default value when no value is provided even when NODE_ENV is production', () => {
		const result = p
			.string({ default: 'foo', optional: true })
			.safeParse(undefined, {
				NODE_ENV: NODE_ENV_PRODUCTION,
			});
		expect(result).toEqual(safeParseSuccess('foo'));
	});

	it('if not optional, uses the provided NODE_ENV to determine whether or not no value is ok', () => {
		const result = p.string({ default: 'foo' }).safeParse(undefined, {
			NODE_ENV: 'not production',
		});
		expect(result).toEqual(safeParseSuccess('foo'));
	});

	it('returns the default value if optional is not true and no value is provided and NODE_ENV is _not_ production', () => {
		const result = p.string({ default: 'foo' }).safeParse(undefined);
		expect(result).toEqual(safeParseSuccess('foo'));
	});
});
