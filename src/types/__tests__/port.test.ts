import { p } from '../..';
import { PEnvError } from '../../p-env-error';
import { PORT_MAXIMUM, PORT_MINIMUM } from '../number';

describe('port', () => {
	it('creates an integer number with min and max set by default', () => {
		const type = p.port({ default: 8080 });
		expect(type.config.minimum).toBe(PORT_MINIMUM);
		expect(type.config.maximum).toBe(PORT_MAXIMUM);
		expect(type.config.integer).toBe(true);
	});

	it('further restricts minimum and maximum if provided inside default range', () => {
		const type = p.port({ default: 8080, minimum: 8080, maximum: 8090 });
		expect(type.config.minimum).toBe(8080);
		expect(type.config.maximum).toBe(8090);
	});

	it('throws if the provided minimum is less than the minimum port minimum', () => {
		const func = () => p.port({ default: 8080, minimum: -1 });
		expect(func).toThrow('less than the minimum port minimum');
		expect(func).toThrow(PEnvError);
	});

	it('throws if the provided maximum is greater than the maximum port maximum', () => {
		const func = () => p.port({ default: 8080, maximum: 100_000 });
		expect(func).toThrow('greater than the maximum port maximum');
		expect(func).toThrow(PEnvError);
	});
});
