import { p } from '../..';

const DEFAULT = { foo: 'bar' as const };

describe('json', () => {
	const field = p.json<{ foo: 'bar' }>({ default: DEFAULT });
	it('parses the provided string as JSON', () => {
		const result = field.safeParse('{"foo":"bar"}');
		if (!result.success) {
			throw new Error('Expected success');
		}
		expect(result.value).toEqual({ foo: 'bar' });
	});

	it('gives a good error message if the value is not JSON', () => {
		const result = field.safeParse('manifold');
		if (result.success) {
			throw new Error('Expected not success');
		}
		expect(result.reason).toMatch(
			'Failed to parse environment string "manifold" as JSON',
		);
	});

	// it('throws if the provided minimum is less than the minimum port minimum', () => {
	// 	const func = () => p.port({ default: 8080, minimum: -1 });
	// 	expect(func).toThrow('less than the minimum port minimum');
	// 	expect(func).toThrow(PEnvError);
	// });

	// it('throws if the provided maximum is greater than the maximum port maximum', () => {
	// 	const func = () => p.port({ default: 8080, maximum: 100_000 });
	// 	expect(func).toThrow('greater than the maximum port maximum');
	// 	expect(func).toThrow(PEnvError);
	// });
});
