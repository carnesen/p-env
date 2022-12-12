import {
	PEnvAbstractFieldType,
	PEnvFieldTypeConfig,
} from '../abstract-field-type';
import { pEnvFailure, PEnvResult, pEnvSuccess } from '../result';

export type PEnvJsonConfig<Parsed = unknown> = PEnvFieldTypeConfig<Parsed>;

export class PEnvJson<
	Parsed_ = unknown,
> extends PEnvAbstractFieldType<Parsed_> {
	private constructor(public readonly config: PEnvFieldTypeConfig<Parsed_>) {
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
