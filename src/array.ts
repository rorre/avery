import { Ok, Result } from './monad/result';
import { nullValidator, Validator } from './validator';

function _createValidator<T>(func: (data: T[]) => Result<T[], string[]>) {
  return {
    validate: func,
    maxLength: (n: number) =>
      _createValidator((data: T[]) =>
        func(data).fmapErr((errs) =>
          data.length > n
            ? [...errs, `Length of array is too big, expected ${n}`]
            : errs
        )
      ),
    nullable: () => nullValidator(func),
  };
}

export function createArrayValidator<T>(baseValidator: Validator<T, string[]>) {
  return _createValidator<T>((data) =>
    data.reduce(
      (a, b) =>
        a.bind((partial) =>
          baseValidator.validate(b).fmap((v) => [...partial, v])
        ),
      Ok([]) as Result<T[], string[]>
    )
  );
}
