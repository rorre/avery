import { createArrayValidator } from './array';
import { createBooleanValidator } from './boolean';
import { createNumberValidator } from './number';
import { createObjectValidator } from './object';
import { createStringValidator } from './string';
import { Validator } from './validator';

export type InferSchema<T> = T extends Validator<infer V, any>
  ? V
  : T extends Record<string, Validator<unknown, unknown>>
  ? {
      [Key in keyof T]: InferSchema<T[Key]>;
    }
  : never;

export const avery = {
  array: createArrayValidator,
  boolean: createBooleanValidator,
  number: createNumberValidator,
  object: createObjectValidator,
  string: createStringValidator,
};
