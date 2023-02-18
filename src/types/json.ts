import { PEnvVar, PEnvVarConfig } from '../p-env-var';
import { pEnvFailure, PEnvResult, pEnvSuccess } from '../p-env-result';

export type PEnvJsonConfig<Parsed = unknown> = PEnvVarConfig<Parsed>;

export class PEnvJson<Parsed_ = unknown> extends PEnvVar<Parsed_> {
	private constructor(public readonly config: PEnvVarConfig<Parsed_>) {
		super(config);
	}

	public safeParse(rawValue: string): PEnvResult<Parsed_> {
		try {
			const jsonParsed: Parsed_ = JSON.parse(rawValue);
			return pEnvSuccess(jsonParsed);
		} catch (exception) {
			return pEnvFailure(
				`Failed to parse environment string "${rawValue}" as JSON: ${exception}`,
			);
		}
	}

	/** Factory for environment variables whose value is a JSON string. By
	 * default the parsed value is typed as `unknown`. You can assert a different
	 * type by using this factory's optional type argument e.g. `p.json<any>({
	 * default: [] })` */
	public static create<Parsed = unknown>(
		options: PEnvJsonConfig<Parsed>,
	): PEnvJson<Parsed> {
		return new PEnvJson(options);
	}
}
