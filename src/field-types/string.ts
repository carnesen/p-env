import { PEnvError } from '../error';
import {
	PEnvAbstractFieldType,
	PEnvFieldTypeConfig,
} from '../abstract-field-type';
import { pEnvFailure, PEnvResult, pEnvSuccess } from '../result';
import { P_ENV_REDACTED_VALUE } from '../constants';

type AnyChoices = undefined | string[] | readonly string[];

type ParsedFromChoices<Choices extends AnyChoices> =
	Choices extends readonly string[]
		? Choices[number]
		: Choices extends string[]
		? Choices[number]
		: string;

export interface PEnvStringConfig<Choices extends AnyChoices>
	extends PEnvFieldTypeConfig<ParsedFromChoices<Choices>> {
	choices?: Choices;
	/** If provided, a value longer than this is considered invalid */
	maxLength?: number;
}

export class PEnvString<
	Choices extends AnyChoices,
> extends PEnvAbstractFieldType<ParsedFromChoices<Choices>> {
	private constructor(readonly config: PEnvStringConfig<Choices>) {
		super(config);
		if (config.maxLength) {
			if (config.maxLength < 0) {
				throw new PEnvError('Config.maxLength must be non-negative');
			}
			if (config.default.length > config.maxLength) {
				throw new PEnvError(
					`Default value "${config.default}" is longer than maxLength=${config.maxLength}`,
				);
			}
		}
	}

	safeParse(envValue: string): PEnvResult<ParsedFromChoices<Choices>> {
		if (
			typeof this.config.maxLength === 'number' &&
			envValue.length > this.config.maxLength
		) {
			return pEnvFailure(`is longer than maxLength=${this.config.maxLength}`);
		}
		if (this.config.choices) {
			if (!this.config.choices.includes(envValue)) {
				return pEnvFailure(
					`is not one of allowed values: ${
						this.config.secret
							? P_ENV_REDACTED_VALUE
							: this.config.choices.join(', ')
					}`,
				);
			}
		}
		return pEnvSuccess(envValue) as PEnvResult<ParsedFromChoices<Choices>>;
	}

	/** Factory for `string`-valued environment variables */
	static create<CreateChoices extends AnyChoices>(
		options: PEnvStringConfig<CreateChoices>,
	): PEnvString<CreateChoices> {
		return new PEnvString(options);
	}
}
