import { Ok, Result } from './monad/result';
import { baseValidator, Validator } from './validator';

type InferSchema<T extends Record<string, Validator<unknown, unknown>>> = {
  [Key in keyof T]: T[Key] extends Validator<infer V, any>
    ? V extends Record<string, Validator<unknown, unknown>>
      ? InferSchema<V>
      : V
    : never;
};

function _createValidator<T>(func: (data: T) => Result<T, string[]>) {
  return baseValidator(func, {});
}

export function createObjectValidator<
  S extends {
    [K in keyof S]: S[K] extends Validator<infer Inner, infer Err>
      ? Validator<Inner, Err>
      : never;
  },
  T = InferSchema<S>
>(schema: S): Validator<T, string[]> {
  const validateFunc = Object.keys(schema).reduce(
    (func, k) => (data) =>
      func(data).bind(
        (partial) =>
          schema[k as keyof S].validate(data[k as keyof T]).fmap((result) => ({
            [k as keyof T]: result as T[keyof T],
            ...partial,
          })) as Result<T, string[]>
      ),
    (data: T) => Ok({} as T) as Result<T, string[]>
  );

  return _createValidator(validateFunc);
}
