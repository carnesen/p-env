import { p } from '../..';
import { pEnvFailure, pEnvSuccess } from '../../p-env-result';

describe('stringOneOfArray', () => {
	const type = p.stringOneOfArray({ default: [], values: ['a', 'b', 'c'] });

	it('splits the environment value on "," and parses each as a one of', () => {
		const parsed = type.safeParse('a,a,c');
		expect(parsed).toEqual(pEnvSuccess(['a', 'a', 'c']));
	});

	it('returns a failure if an item cannot be converted to a number', () => {
		const parsed = type.safeParse('1,x,3');

		expect(parsed).toEqual(
			pEnvFailure('is not one of the allowed values: "a", "b", "c"'),
		);
	});
});
