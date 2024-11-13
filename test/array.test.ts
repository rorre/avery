import { describe, it } from 'bun:test';
import { avery } from '../src/';
import { Ok, Err } from '../src/monad/result';
import { expectResultEqual } from './utils';

describe('Array Validator Tests', () => {
  it('should validate array of strings correctly', () => {
    const stringValidator = avery.string();
    const arrayValidator = avery.array(stringValidator);

    expectResultEqual(
      arrayValidator.validate(['valid', 'string']),
      Ok(['valid', 'string'])
    );
    expectResultEqual(
      arrayValidator.validate(['valid', 123]),
      Err(['[1]: Data is not string, received number'])
    );
  });

  it('should validate array with maxLength correctly', () => {
    const stringValidator = avery.string();
    const arrayValidator = avery.array(stringValidator).maxLength(2);

    expectResultEqual(
      arrayValidator.validate(['valid', 'string']),
      Ok(['valid', 'string'])
    );
    expectResultEqual(
      arrayValidator.validate(['valid', 'string', 'too long']),
      Err(['Array too long'])
    );
  });

  it('should handle nullable arrays correctly', () => {
    const stringValidator = avery.string();
    const arrayValidator = avery.array(stringValidator).nullable();

    expectResultEqual(arrayValidator.validate(null), Ok(null));
    expectResultEqual(
      arrayValidator.validate(['valid', 'string']),
      Ok(['valid', 'string'])
    );
    expectResultEqual(
      arrayValidator.validate(['valid', 123 as any]),
      Err(['[1]: Data is not string, received number'])
    );
  });

  it('should validate nested arrays correctly', () => {
    const stringValidator = avery.string();
    const nestedArrayValidator = avery.array(avery.array(stringValidator));

    expectResultEqual(
      nestedArrayValidator.validate([['valid'], ['string']]),
      Ok([['valid'], ['string']])
    );
    expectResultEqual(
      nestedArrayValidator.validate([['valid'], [123 as any]]),
      Err(['[1]: [0]: Data is not string, received number'])
    );
  });

  it('should validate empty arrays correctly', () => {
    const stringValidator = avery.string();
    const arrayValidator = avery.array(stringValidator);

    expectResultEqual(arrayValidator.validate([]), Ok([]));
  });

  it('should handle complex array validation correctly', () => {
    const stringValidator = avery
      .string()
      .minLength(3)
      .maxLength(10)
      .nullable();
    const arrayValidator = avery.array(stringValidator).maxLength(3);

    expectResultEqual(
      arrayValidator.validate(['valid', 'string', null]),
      Ok(['valid', 'string', null])
    );
    expectResultEqual(
      arrayValidator.validate(['no', 'valid']),
      Err(['[0]: Value no is too short'])
    );
    expectResultEqual(
      arrayValidator.validate(['valid', 'string is wayyyy too long']),
      Err(['[1]: Value string is wayyyy too long is too long'])
    );
    expectResultEqual(
      arrayValidator.validate(['valid', 'string', 'too', 'long']),
      Err(['Array too long'])
    );
  });
});
