import { p } from '../..';
import { pEnvFailure, pEnvSuccess } from '../../p-env-result';

describe('numberArray', () => {
	const type = p.numberArray({ default: [] });

	it('splits the environment value on "," and parses each as a number', () => {
		const parsed = type.safeParse('1,2,3');
		expect(parsed).toEqual(pEnvSuccess([1, 2, 3]));
	});

	it('returns a failure if an item cannot be converted to a number', () => {
		const parsed = type.safeParse('1,x,3');

		expect(parsed).toEqual(pEnvFailure("can't be converted to a number"));
	});
});
