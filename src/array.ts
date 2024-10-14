import { Ok, Result } from './monad/result';
import { Validator } from './validator';

export function createArrayValidator<T>(baseValidator: Validator<T, string[]>) {
  const _createValidator = (func: (data: T[]) => Result<T[], string[]>) => ({
    validate: func,
    maxLength: (n: number) =>
      _createValidator((data) =>
        func(data).fmapErr((errs) =>
          data.length > n
            ? [...errs, `Length of array is too big, expected ${n}`]
            : errs
        )
      ),
  });

  return _createValidator((data) =>
    data.reduce(
      (a, b) =>
        a.bind((partial) =>
          baseValidator.validate(b).fmap((v) => [...partial, v])
        ),
      Ok([]) as Result<T[], string[]>
    )
  );
}
