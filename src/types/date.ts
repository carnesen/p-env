import { PEnvVar, PEnvVarConfig } from '../p-env-var';
import { pEnvFailure, PEnvResult, pEnvSuccess } from '../p-env-result';

export type PEnvDateConfig = PEnvVarConfig<Date>;

export class PEnvDate extends PEnvVar<Date> {
	private constructor(public readonly config: PEnvDateConfig) {
		super(config);
	}

	public safeParse(rawValue: string): PEnvResult<Date> {
		const date = new Date(rawValue.trim());
		// https://stackoverflow.com/a/1353711/2793540
		if (Number.isNaN(date.valueOf())) {
			return pEnvFailure("can't be converted to a date");
		}
		return pEnvSuccess(date);
	}

	/** Factory for `Date`-valued environment variables */
	public static create(options: PEnvDateConfig): PEnvDate {
		return new PEnvDate(options);
	}
}
