import { Err, Ok, Result } from './monad/result';
import { baseValidator, Validator } from './validator';

type InferSchema<T extends Record<string, Validator<unknown, unknown>>> = {
  [Key in keyof T]: T[Key] extends Validator<infer V, any>
    ? V extends Record<string, Validator<unknown, unknown>>
      ? InferSchema<V>
      : V
    : never;
};

type InferErrorSchema<T extends Record<string, Validator<unknown, unknown>>> = {
  [Key in keyof T]: T[Key] extends Validator<any, infer V>
    ? V extends Record<string, Validator<unknown, unknown>>
      ? InferSchema<V>
      : V
    : never;
};

function _createValidator<T, E>(func: (data: any) => Result<T, E>) {
  return baseValidator(func, {});
}

type Err = {
  [k: string]: string[] | Err;
};

function errorObjectToArray(prefix: string, errors: Err): string[] {
  return Object.entries(errors).flatMap(([k, v]) =>
    Array.isArray(v)
      ? v.map((e) => `${prefix}.${k}: ${e}`)
      : errorObjectToArray(prefix ? `${prefix}.${k}` : k, v)
  );
}

export function createObjectValidator<
  S extends {
    [K in keyof S]: S[K] extends Validator<infer Inner, infer Err>
      ? Validator<Inner, Err>
      : never;
  },
  T = InferSchema<S>
>(schema: S): Validator<T, string[]> {
  function validateFunc(data: any): Result<T, string[]> {
    return Object.keys(schema)
      .map(
        (key) =>
          [
            key as keyof S,
            schema[key as keyof S].validate(data[key]) as Result<T, string[]>,
          ] as const
      )
      .reduce(
        (prev, [k, result]) =>
          prev
            .bind(
              (value) =>
                (result.isOk()
                  ? Ok({
                      [k]: result.unwrap(),
                      ...value,
                    })
                  : Err({})) as Result<T, InferErrorSchema<S>>
            )
            .fmapErr((err) =>
              result.isErr()
                ? {
                    ...err,
                    [k]: result.unwrapErr(),
                  }
                : err
            ),
        Ok({} as T) as Result<T, InferErrorSchema<S>>
      )
      .fmapErr((errors) => errorObjectToArray('', errors as Err));
  }

  const ensureObject = (data: any) =>
    (typeof data === 'object' && !Array.isArray(data) && data !== null
      ? Ok(data as T)
      : Err([`Data is not object, got ${typeof data}`])) as Result<T, string[]>;

  return _createValidator((data) => ensureObject(data).bind(validateFunc));
}
