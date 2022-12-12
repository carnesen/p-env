import {
	PEnvAbstractFieldType,
	PEnvFieldTypeConfig,
} from '../abstract-field-type';
import { pEnvFailure, PEnvResult, pEnvSuccess } from '../result';

export type PEnvBigIntConfig = PEnvFieldTypeConfig<bigint>;

export class PEnvBigInt extends PEnvAbstractFieldType<bigint> {
	private constructor(public readonly config: PEnvBigIntConfig) {
		super(config);
	}

	public safeParse(rawValue: string): PEnvResult<bigint> {
		const trimmed = rawValue.trim();
		if (trimmed.length === 0) {
			return pEnvFailure('unwilling to convert empty string to bigint');
		}
		try {
			const parsed = BigInt(rawValue);
			return pEnvSuccess(parsed);
		} catch (exception) {
			if (exception instanceof Error) {
				return pEnvFailure(exception.message);
			}
			throw exception;
		}
	}

	/** Factory for bigint-valued environment variables */
	public static create(options: PEnvBigIntConfig): PEnvBigInt {
		return new PEnvBigInt(options);
	}
}
