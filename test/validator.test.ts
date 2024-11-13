import { describe, it, expect } from 'bun:test';
import { baseValidator, nullValidator, runCheck } from '../src/validator';
import { Ok, Err } from '../src/monad/result';
import { expectResultEqual } from './utils';

describe('Validator Tests', () => {
  it('should create checks correctly', () => {
    const checkFunc = (value: string) =>
      value.length > 3 ? undefined : 'Too short';
    const result = runCheck(checkFunc, Ok('valid'));

    expectResultEqual(result, Ok('valid'));

    const result2 = runCheck(checkFunc, Ok('no'));
    expectResultEqual(result2, Err(['Too short']));
  });

  it('should handle null validator correctly', () => {
    const validateFunc = (data: string) =>
      data === 'valid' ? Ok(data) : Err('Invalid data');
    const validator = nullValidator(validateFunc);

    expectResultEqual(validator.validate(null), Ok(null));
    expectResultEqual(validator.validate('valid'), Ok('valid'));
    expectResultEqual(validator.validate('invalid'), Err('Invalid data'));
  });

  it('should handle additional properties in baseValidator', () => {
    const validateFunc = (data: string) =>
      data === 'valid' ? Ok(data) : Err('Invalid data');
    const additional = { extra: 'extraProperty' };
    const validator = baseValidator(validateFunc, additional);

    expectResultEqual(validator.validate('valid'), Ok('valid'));
    expectResultEqual(validator.validate('invalid'), Err('Invalid data'));
    expect(validator.extra).toBe('extraProperty');
  });
});
