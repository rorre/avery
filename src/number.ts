import { Err, Ok, Result } from './monad/result';
import { baseValidator, runCheck, Validator } from './validator';

/**
 * A validator that can validate a number value.
 * @example
 * const validator = avery.number();
 * const result = validator.validate(42);
 * console.log(result.isOk()); // Output: true
 */
export type NumberValidator = Validator<number, string[]> & {
  /**
   * Checks if the value is equal to the given value.
   * @example
   * const validator = avery.number().eq(10);
   * console.log(validator.validate(10).isOk()); // Output: true
   * console.log(validator.validate(5).isOk()); // Output: false
   * @param n The value to compare against.
   * @returns A new validator with the equal check.
   */
  eq: (n: number) => NumberValidator;

  /**
   * Checks if the value is less than n.
   * @example
   * const validator = avery.number().lt(10);
   * console.log(validator.validate(5).isOk()); // Output: true
   * console.log(validator.validate(10).isOk()); // Output: false
   * @param n The value to compare against.
   * @returns A new validator with the less than check.
   */
  lt: (n: number) => NumberValidator;

  /**
   * Checks if the value is less than or equal to n.
   * @example
   * const validator = avery.number().lte(10);
   * console.log(validator.validate(10).isOk()); // Output: true
   * console.log(validator.validate(15).isOk()); // Output: false
   * @param n The value to compare against.
   * @returns A new validator with the less than or equal check.
   */
  lte: (n: number) => NumberValidator;

  /**
   * Checks if the value is greater than n.
   * @example
   * const validator = avery.number().gt(10);
   * console.log(validator.validate(15).isOk()); // Output: true
   * console.log(validator.validate(10).isOk()); // Output: false
   * @param n The value to compare against.
   * @returns A new validator with the greater than check.
   */
  gt: (n: number) => NumberValidator;

  /**
   * Checks if the value is greater than or equal to n.
   * @example
   * const validator = avery.number().gte(10);
   * console.log(validator.validate(10).isOk()); // Output: true
   * console.log(validator.validate(5).isOk()); // Output: false
   * @param n The value to compare against.
   * @returns A new validator with the greater than or equal check.
   */
  gte: (n: number) => NumberValidator;
  /**
   * Checks if the value is an integer.
   * @example
   * const validator = avery.number().int();
   * console.log(validator.validate(10).isOk()); // Output: true
   * console.log(validator.validate(10.5).isOk()); // Output: false
   * @returns A new validator with the integer check.
   */
  int: () => NumberValidator;
  /**
   * Checks if the value is finite.
   * @example
   * const validator = avery.number().finite();
   * console.log(validator.validate(10).isOk()); // Output: true
   * console.log(validator.validate(Infinity).isOk()); // Output: false
   * @returns A new validator with the finite
   */
  finite: () => NumberValidator;
};

function _createValidator(func: (data: number) => Result<number, string[]>) {
  return baseValidator(func, {
    eq: (value: number) =>
      _createValidator((data) =>
        runCheck(
          (res) =>
            res != value ? `Value ${res} does not equal ${value}` : null,
          func(data)
        )
      ),
    gt: (value: number) =>
      _createValidator((data) =>
        runCheck(
          (res) =>
            res <= value ? `Value ${res} is not greater than ${value}` : null,
          func(data)
        )
      ),
    gte: (value: number) =>
      _createValidator((data) =>
        runCheck(
          (res) =>
            res < value
              ? `Value ${res} is not greater than or equal to ${value}`
              : null,
          func(data)
        )
      ),
    lt: (value: number) =>
      _createValidator((data) =>
        runCheck(
          (res) =>
            res >= value ? `Value ${res} is not less than ${value}` : null,
          func(data)
        )
      ),
    lte: (value: number) =>
      _createValidator((data) =>
        runCheck(
          (res) =>
            res > value
              ? `Value ${res} is not less than or equal to ${value}`
              : null,
          func(data)
        )
      ),
    int: () =>
      _createValidator((data) =>
        runCheck(
          (val) =>
            !Number.isInteger(val) ? `Value ${val} is not an integer` : null,
          func(data)
        )
      ),
    finite: () =>
      _createValidator((data) =>
        runCheck(
          (val) =>
            !Number.isFinite(val) ? `Value ${val} is not finite` : null,
          func(data)
        )
      ),
  });
}

/** @private */
export function createNumberValidator() {
  return _createValidator((data) =>
    typeof data === 'number'
      ? Ok(data)
      : Err([`Data is not number, got ${typeof data}`])
  );
}
