import { describe, it } from 'bun:test';
import { avery } from '../src/';
import { Ok, Err } from '../src/monad/result';
import { expectResultEqual } from './utils';

describe('Boolean Validator Tests', () => {
  it('should validate boolean correctly', () => {
    const validator = avery.boolean();

    expectResultEqual(validator.validate(true), Ok(true));
    expectResultEqual(validator.validate(false), Ok(false));
    expectResultEqual(
      validator.validate('true' as any),
      Err(['Data is not boolean, got string'])
    );
  });

  it('should handle nullable booleans correctly', () => {
    const validator = avery.boolean().nullable();

    expectResultEqual(validator.validate(null), Ok(null));
    expectResultEqual(validator.validate(true), Ok(true));
    expectResultEqual(validator.validate(false), Ok(false));
    expectResultEqual(
      validator.validate('true' as any),
      Err(['Data is not boolean, got string'])
    );
  });

  it('should validate equality correctly', () => {
    const validator = avery.boolean().eq(true);

    expectResultEqual(validator.validate(true), Ok(true));
    expectResultEqual(
      validator.validate(false),
      Err(['Value false does not equal true'])
    );

    const validatorFalse = avery.boolean().eq(false);

    expectResultEqual(validatorFalse.validate(false), Ok(false));
    expectResultEqual(
      validatorFalse.validate(true),
      Err(['Value true does not equal false'])
    );
  });

  it('should handle complex boolean validation correctly', () => {
    const validator = avery.boolean().eq(true).nullable();

    expectResultEqual(validator.validate(null), Ok(null));
    expectResultEqual(validator.validate(true), Ok(true));
    expectResultEqual(
      validator.validate(false),
      Err(['Value false does not equal true'])
    );
    expectResultEqual(
      validator.validate('true' as any),
      Err(['Data is not boolean, got string'])
    );
  });
});
