import { Err, Ok, Result } from './monad/result';
import { baseValidator, runCheck, Validator } from './validator';

/**
 * A validator that can validate a boolean value.
 * @example
 * const validator = avery.boolean();
 * const result = validator.validate(true);
 * console.log(result.isOk()); // Output: true
 */
export type BooleanValidator = Validator<boolean, string[]> & {
  /**
   * Checks if the value is equal to the given value.
   * @param value The value to compare against.
   * @returns A new validator with the equal check.
   * @example
   * const validator = avery.boolean().eq(true);
   * const result = validator.validate(false);
   * console.log(result.isOk()); // Output: false
   */
  eq: (value: boolean) => BooleanValidator;
};

function _createValidator(
  func: (data: boolean) => Result<boolean, string[]>
): BooleanValidator {
  return baseValidator(func, {
    eq: (value: boolean) =>
      _createValidator((data) =>
        runCheck(
          (res) =>
            res != value ? `Value ${res} does not equal ${value}` : null,
          func(data)
        )
      ),
  });
}

/** @private */
export function createBooleanValidator() {
  return _createValidator((data) =>
    typeof data === 'boolean'
      ? Ok(data)
      : Err([`Data is not boolean, got ${typeof data}`])
  );
}
