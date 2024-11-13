import { describe, it } from 'bun:test';
import { avery } from '../src/index';
import { Ok, Err } from '../src/monad/result';
import { expectResultEqual } from './utils';

describe('String Validator Tests', () => {
  it('should validate string correctly', () => {
    const validator = avery.string();

    expectResultEqual(validator.validate('valid string'), Ok('valid string'));
    expectResultEqual(
      validator.validate(123 as any),
      Err(['Data is not string, received number'])
    );
  });

  it('should validate minimum length correctly', () => {
    const validator = avery.string().minLength(5);

    expectResultEqual(validator.validate('valid'), Ok('valid'));
    expectResultEqual(validator.validate('no'), Err(['Value no is too short']));
  });

  it('should validate maximum length correctly', () => {
    const validator = avery.string().maxLength(5);

    expectResultEqual(validator.validate('valid'), Ok('valid'));
    expectResultEqual(
      validator.validate('too long string'),
      Err(['Value too long string is too long'])
    );
  });

  it('should validate both minimum and maximum length correctly', () => {
    const validator = avery.string().minLength(3).maxLength(10);

    expectResultEqual(validator.validate('valid'), Ok('valid'));
    expectResultEqual(validator.validate('no'), Err(['Value no is too short']));
    expectResultEqual(
      validator.validate('very long string that is too long'),
      Err(['Value very long string that is too long is too long'])
    );
  });

  it('should handle nullable strings correctly', () => {
    const validator = avery.string().nullable();

    expectResultEqual(validator.validate(null), Ok(null));
    expectResultEqual(validator.validate('valid string'), Ok('valid string'));
    expectResultEqual(
      validator.validate(123 as any),
      Err(['Data is not string, received number'])
    );
  });

  it('should validate empty string correctly', () => {
    const validator = avery.string();

    expectResultEqual(validator.validate(''), Ok(''));
  });

  it('should validate string with special characters correctly', () => {
    const validator = avery.string();

    expectResultEqual(validator.validate('!@#$%^&*()'), Ok('!@#$%^&*()'));
  });

  it('should validate string with spaces correctly', () => {
    const validator = avery.string();

    expectResultEqual(validator.validate('   '), Ok('   '));
    expectResultEqual(
      validator.validate('valid string with spaces'),
      Ok('valid string with spaces')
    );
  });
});
