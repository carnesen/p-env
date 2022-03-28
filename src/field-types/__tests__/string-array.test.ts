import { p } from '../..';
import { pEnvSuccess } from '../../result';

describe('stringArray', () => {
	const type = p.stringArray({ default: [] });

	it('splits the environment value on ","', () => {
		const parsed = type.safeParse('foo,bar,baz');
		expect(parsed).toEqual(pEnvSuccess(['foo', 'bar', 'baz']));
	});
});
