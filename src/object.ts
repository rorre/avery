import { InferSchema } from './index';
import { Err, Ok, Result } from './monad/result';
import { baseValidator, Validator } from './validator';

export type InferErrorSchema<T> = T extends Validator<unknown, infer V>
  ? V
  : T extends Record<string, Validator<unknown, unknown>>
  ? {
      [Key in keyof T]: InferErrorSchema<T[Key]>;
    }
  : never;

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
  S extends Record<string, Validator<unknown, unknown>>,
  T extends InferSchema<S> = InferSchema<S>
>(schema: S): Validator<T, string[]> {
  function validateFunc(data: any): Result<T, string[]> {
    return (
      Object.keys(schema)
        // First, we want to run all validation in all keys inside the schema
        // NOTE: Nonexisting key would return `undefined` error.
        .map(
          (key) =>
            // Store the key since we want to refer that during aggregation
            [
              key as keyof S,
              schema[key as keyof S].validate(data[key]) as Result<
                T[keyof T],
                string[]
              >,
            ] as const
        )
        // Then, we aggregate the result
        .reduce(
          (prev, [k, result]) =>
            prev
              // We want to transform this into Err() if we encounter any validation error
              .bind((value) =>
                result.isOk()
                  ? Ok({
                      [k]: result.unwrap(),
                      ...value,
                    })
                  : Err<Partial<T>, Partial<InferErrorSchema<S>>>({})
              )
              // Add current error as key: Err
              .fmapErr((err) =>
                result.isErr()
                  ? {
                      ...err,
                      [k]: result.unwrapErr(),
                    }
                  : err
              ),
          // Start with an empty Ok(), at the end we will have the entire object if checks are successful
          Ok<Partial<T>, Partial<InferErrorSchema<S>>>({})
        )
        // The error object is currently shaped like the object, so flatten out to an array of messages
        .fmapErr((errors) => errorObjectToArray('', errors as Err))
        .fmap((val) => val as T)
    );
  }

  const ensureObject = (data: any) =>
    (typeof data === 'object' && !Array.isArray(data) && data !== null
      ? Ok(data as T)
      : Err([`Data is not object, got ${typeof data}`])) as Result<T, string[]>;

  return _createValidator((data) => ensureObject(data).bind(validateFunc));
}
