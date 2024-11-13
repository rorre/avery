import { describe, it } from 'bun:test';
import { avery } from '../src/';
import { Ok, Err } from '../src/monad/result';
import { expectResultEqual } from './utils';

describe('Number Validator Tests', () => {
  it('should validate number correctly', () => {
    const validator = avery.number();

    expectResultEqual(validator.validate(123), Ok(123));
    expectResultEqual(
      validator.validate('123' as any),
      Err(['Data is not number, got string'])
    );
  });

  it('should validate equality correctly', () => {
    const validator = avery.number().eq(10);

    expectResultEqual(validator.validate(10), Ok(10));
    expectResultEqual(
      validator.validate(5),
      Err(['Value 5 does not equal 10'])
    );
  });

  it('should validate greater than correctly', () => {
    const validator = avery.number().gt(10);

    expectResultEqual(validator.validate(15), Ok(15));
    expectResultEqual(
      validator.validate(10),
      Err(['Value 10 is not greater than 10'])
    );
  });

  it('should validate greater than or equal to correctly', () => {
    const validator = avery.number().gte(10);

    expectResultEqual(validator.validate(10), Ok(10));
    expectResultEqual(
      validator.validate(5),
      Err(['Value 5 is not greater than or equal to 10'])
    );
  });

  it('should validate less than correctly', () => {
    const validator = avery.number().lt(10);

    expectResultEqual(validator.validate(5), Ok(5));
    expectResultEqual(
      validator.validate(10),
      Err(['Value 10 is not less than 10'])
    );
  });

  it('should validate less than or equal to correctly', () => {
    const validator = avery.number().lte(10);

    expectResultEqual(validator.validate(10), Ok(10));
    expectResultEqual(
      validator.validate(15),
      Err(['Value 15 is not less than or equal to 10'])
    );
  });

  it('should validate integer correctly', () => {
    const validator = avery.number().int();

    expectResultEqual(validator.validate(10), Ok(10));
    expectResultEqual(
      validator.validate(10.5),
      Err(['Value 10.5 is not an integer'])
    );
  });

  it('should validate finite number correctly', () => {
    const validator = avery.number().finite();

    expectResultEqual(validator.validate(10), Ok(10));
    expectResultEqual(
      validator.validate(Infinity),
      Err(['Value Infinity is not finite'])
    );
  });

  it('should handle nullable numbers correctly', () => {
    const validator = avery.number().nullable();

    expectResultEqual(validator.validate(null), Ok(null));
    expectResultEqual(validator.validate(123), Ok(123));
    expectResultEqual(
      validator.validate('123' as any),
      Err(['Data is not number, got string'])
    );
  });

  it('should handle complex number validation correctly', () => {
    const validator = avery.number().gt(5).lt(15).int();

    expectResultEqual(validator.validate(10), Ok(10));
    expectResultEqual(
      validator.validate(5),
      Err(['Value 5 is not greater than 5'])
    );
    expectResultEqual(
      validator.validate(15),
      Err(['Value 15 is not less than 15'])
    );
    expectResultEqual(
      validator.validate(10.5),
      Err(['Value 10.5 is not an integer'])
    );
  });
});
