import { Err, Ok, Result } from './monad/result';
import { baseValidator, runCheck, Validator } from './validator';

/**
 * A validator that can validate an array based on the validator given.
 * @template T The type of the array.
 * @example
 * const validator = avery.array(avery.string());
 * const result = validator.validate(['hello', 'world']);
 * console.log(result.isOk()); // Output: true
 */
export type ArrayValidator<T> = Validator<T[], string[]> & {
  /**
   * Checks if the array's length is equal or lower than n.
   * @param n The maximum length of the array.
   * @returns A new validator with the max length check.
   */
  maxLength: (n: number) => ArrayValidator<T>;
};

function _createValidator<T>(
  func: (data: T[]) => Result<T[], string[]>
): ArrayValidator<T> {
  return baseValidator(func, {
    maxLength: (n: number) =>
      _createValidator((data: T[]) =>
        runCheck(
          (res) => (res.length > n ? `Array too long` : null),
          func(data)
        )
      ),
  });
}

/** @private */
export function createArrayValidator<T>(baseValidator: Validator<T, string[]>) {
  return _createValidator<T>((data) =>
    data
      // Run validation for all member of the array
      .map((value) => baseValidator.validate(value))
      // Aggregate the result
      .reduce(
        (a, b, idx) =>
          a
            // We want to be able to transform into Err() if we stumble upon any validation error
            .bind((partial) =>
              b.isOk() ? Ok([...partial, b.unwrap()]) : Err<T[], string[]>([])
            )
            // Add the error message
            .fmapErr((err) =>
              b.isErr()
                ? [
                    ...err,
                    ...b.unwrapErr().map((error) => `[${idx}]: ${error}`),
                  ]
                : err
            ),
        Ok<T[], string[]>([])
      )
  );
}
