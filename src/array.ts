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
      .map((value) => baseValidator.validate(value))
      .reduce(
        (a, b, idx) =>
          a
            .bind(
              (partial) =>
                (b.isOk() ? Ok([...partial, b.unwrap()]) : Err([])) as Result<
                  T[],
                  string[]
                >
            )
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
