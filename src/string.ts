import { Err, Ok, Result } from './monad/result';
import { baseValidator, runCheck, Validator } from './validator';

/**
 * A validator that can validate a string value.
 * @example
 * const validator = avery.string();
 * const result = validator.validate('hello');
 * console.log(result.isOk()); // Output: true
 */
export type StringValidator = Validator<string, string[]> & {
  /**
   * Checks if the string's length is equal or greater than n.
   * @example
   * const validator = avery.string().minLength(5);
   * console.log(validator.validate('hello').isOk()); // Output: true
   * console.log(validator.validate('hi').isOk()); // Output: false
   * @param n The minimum length of the string.
   * @returns A new validator with the min length check.
   */
  minLength: (n: number) => StringValidator;
  /**
   * Checks if the string's length is equal or lower than n.
   * @example
   * const validator = avery.string().maxLength(5);
   * console.log(validator.validate('hello').isOk()); // Output: true
   * console.log(validator.validate('hello world').isOk()); // Output: false
   * @param n The maximum length of the string.
   * @returns A new validator with the max length check.
   */
  maxLength: (n: number) => StringValidator;
};

function _createValidator(
  func: (data: string) => Result<string, string[]>
): StringValidator {
  return baseValidator(func, {
    minLength: (n: number) =>
      _createValidator((data) =>
        runCheck(
          (res) => (res.length < n ? `Value ${res} is too short` : null),
          func(data)
        )
      ),
    maxLength: (n: number) =>
      _createValidator((data) =>
        runCheck(
          (res) => (res.length > n ? `Value ${res} is too long` : null),
          func(data)
        )
      ),
  });
}

/** @private */
export function createStringValidator() {
  return _createValidator((data) =>
    typeof data === 'string'
      ? Ok(data)
      : Err([`Data is not string, received ${typeof data}`])
  );
}
