import { createArrayValidator } from './array';
import { createBooleanValidator } from './boolean';
import { createNumberValidator } from './number';
import { createObjectValidator } from './object';
import { createStringValidator } from './string';
import { Validator } from './validator';

/**
 * Infers the schema type from a schema validator.
 * @example
 * const schema = avery.object({
 *  name: avery.string(),
 *  age: avery.number(),
 * });
 * type Schema = InferSchema<typeof schema>;
 * //   ^^^^^^ = { name: string, age: number }
 */
export type InferSchema<T> = T extends Validator<infer V, any>
  ? V
  : T extends Record<string, Validator<unknown, unknown>>
  ? {
      [Key in keyof T]: InferSchema<T[Key]>;
    }
  : never;

/**
 * The main entry point for creating schemas.
 */
export const avery = {
  array: createArrayValidator,
  boolean: createBooleanValidator,
  number: createNumberValidator,
  object: createObjectValidator,
  string: createStringValidator,
};

export * from './validator';
export * from './array';
export * from './boolean';
export * from './number';
export * from './object';
export * from './string';
export * from './monad/result';
