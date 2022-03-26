import { p } from '..';
import { safeParseSuccess } from '../safe-parse-result';

describe('stringArray', () => {
	const type = p.stringArray({ default: [] });

	it('splits the environment value on ","', () => {
		const parsed = type.safeParse('foo,bar,baz');
		expect(parsed).toEqual(safeParseSuccess(['foo', 'bar', 'baz']));
	});
});
