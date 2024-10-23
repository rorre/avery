import { createArrayValidator } from './array';
import { createBooleanValidator } from './boolean';
import { createNumberValidator } from './number';
import { createObjectValidator } from './object';
import { createStringValidator } from './string';

export const sum = (a: number, b: number) => {
  if ('development' === process.env.NODE_ENV) {
    console.log('dev only output');
  }
  return a + b;
};

export const avery = {
  array: createArrayValidator,
  boolean: createBooleanValidator,
  number: createNumberValidator,
  object: createObjectValidator,
  string: createStringValidator,
};
