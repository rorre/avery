import { Err, Ok, Result } from './monad/result';
import { baseValidator, nullValidator, Validator } from './validator';

function _createValidator<T>(
  func: (data: T[]) => Result<T[], string[]>
): Validator<T[], string[]> & {
  maxLength: (n: number) => ReturnType<typeof _createValidator<T>>;
} {
  return baseValidator(func, {
    maxLength: (n: number) =>
      _createValidator((data: T[]) =>
        func(data).fmapErr((errs) =>
          data.length > n
            ? [...errs, `Length of array is too big, expected ${n}`]
            : errs
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
            .bind(
              (partial) =>
                (b.isOk() ? Ok([...partial, b.unwrap()]) : Err([])) as Result<
                  T[],
                  string[]
                >
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
        Ok([]) as Result<T[], string[]>
      )
  );
}
