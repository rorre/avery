import { Err, Ok, Result } from './monad/result';
import { baseValidator, Validator } from './validator';

type InferSchema<T extends Record<string, Validator<unknown, unknown>>> = {
  [Key in keyof T]: T[Key] extends Validator<infer V, any>
    ? V extends Record<string, Validator<unknown, unknown>>
      ? InferSchema<V>
      : V
    : never;
};

function _createValidator<T>(func: (data: any) => Result<T, string[]>) {
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
    (data: any) => Ok({} as T) as Result<T, string[]>
  );

  const ensureObject = (data: any) =>
    (typeof data === 'object' && !Array.isArray(data) && data !== null
      ? Ok(data as T)
      : Err([`Data is not number, got ${typeof data}`])) as Result<T, string[]>;

  return _createValidator((data) => ensureObject(data).bind(validateFunc));
}
