import { p } from '..';

describe('stringArray', () => {
	const type = p.stringArray({ default: [] });

	it('splits the environment value on ","', () => {
		const parsed = type.parse('foo,bar,baz');
		expect(parsed).toEqual(['foo', 'bar', 'baz']);
	});
});
