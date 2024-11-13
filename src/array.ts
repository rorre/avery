import { Err, Ok, Result } from './monad/result';
import { baseValidator, runCheck, Validator } from './validator';

function _createValidator<T>(
  func: (data: T[]) => Result<T[], string[]>
): Validator<T[], string[]> & {
  maxLength: (n: number) => ReturnType<typeof _createValidator<T>>;
} {
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
