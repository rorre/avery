import { Err, Ok, Result } from './monad/result';

/** @private */
export type ValidateFunc<T, E> = (data: T) => Result<T, E>;

/**
 * A validator that can validate a given data.
 */
export interface Validator<T, E> {
  /**
   * Validates the given data.
   * @param data The data to validate.
   * @returns The validation result.
   * @example
   * const validator = avery.string();
   * const result = validator.validate('hello');
   * console.log(result.isOk()); // Output: true
   */
  validate: (data: any) => Result<T, E>;
  /**
   * Returns a new validator that can handle nullable data.
   * @returns A new validator that can handle nullable data.
   * @example
   * const validator = avery.string().nullable();
   * const result = validator.validate(null);
   * console.log(result.isOk()); // Output: true
   */
  nullable: () => Validator<T | null, E>;
}

/**
 * Create a new validator that accepts null.
 * @param func Base validator function
 * @returns new Validator object that can accept null.
 * @private
 */
export const nullValidator = <T, E>(func: ValidateFunc<T, E>) => ({
  validate: (data: any) =>
    (data == null ? Ok(null) : func(data)) as Result<T, E>,
  nullable: () => nullValidator(func),
});

/**
 * Create a new validator.
 * @param func Base validator function
 * @param additional Additional properties to add to the validator.
 * @returns new Validator object.
 * @private
 */
export const baseValidator = <T, Additional extends Record<string, any>, E>(
  func: (data: any) => Result<T, E>,
  additional: Additional
): Validator<T, E> & Additional => ({
  validate: func,
  nullable: () => nullValidator(func),
  ...additional,
});

/** @private */
export function runCheck<T>(
  func: (value: T) => string | undefined | null,
  currentResult: Result<T, string[]>
) {
  return currentResult.bind((value) => {
    const checkResult = func(value);
    if (checkResult) return Err<T, string[]>([checkResult]);
    return Ok(value);
  });
}
