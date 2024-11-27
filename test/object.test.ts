import { describe, it } from 'bun:test';
import { avery } from '../src/';
import { Ok, Err } from '../src/monad/result';
import { expectResultEqual } from './utils';

describe('Object Validator Tests', () => {
  it('should validate object with string and number correctly', () => {
    const schema = {
      name: avery.string(),
      age: avery.number(),
    };
    const validator = avery.object(schema);

    expectResultEqual(
      validator.validate({ name: 'John', age: 30 }),
      Ok({ name: 'John', age: 30 })
    );
    expectResultEqual(
      validator.validate({ name: 'John', age: '30' }),
      Err(['.age: Data is not number, got string'])
    );
    expectResultEqual(
      validator.validate({ name: 123, age: 30 }),
      Err(['.name: Data is not string, received number'])
    );
  });

  it('should handle nullable object correctly', () => {
    const schema = {
      name: avery.string(),
      age: avery.number(),
    };
    const validator = avery.object(schema).nullable();

    expectResultEqual(validator.validate(null), Ok(null));
    expectResultEqual(
      validator.validate({ name: 'John', age: 30 }),
      Ok({ name: 'John', age: 30 })
    );
    expectResultEqual(
      validator.validate({ name: 'John', age: '30' }),
      Err(['.age: Data is not number, got string'])
    );
  });

  it('should validate nested objects correctly', () => {
    const schema = {
      user: avery.object({
        name: avery.string(),
        age: avery.number(),
        school: avery.object({
          name: avery.string(),
          address: avery.string(),
        }),
      }),
    };
    const validator = avery.object(schema);

    expectResultEqual(
      validator.validate({
        user: {
          name: 'John',
          age: 30,
          school: {
            name: 'School',
            address: '123 Street',
          },
        },
      }),
      Ok({
        user: {
          name: 'John',
          age: 30,
          school: {
            name: 'School',
            address: '123 Street',
          },
        },
      })
    );
    expectResultEqual(
      validator.validate({
        user: {
          name: 'John',
          age: '30',
          school: {
            name: 123,
            address: '123 Street',
          },
        },
      }),
      Err([
        '.user: .age: Data is not number, got string',
        '.user: .school: .name: Data is not string, received number',
      ])
    );
    expectResultEqual(
      validator.validate({
        user: { name: 123, age: 30 },
        school: {
          name: 'School',
          address: '123 Street',
        },
      }),
      Err([
        '.user: .name: Data is not string, received number',
        '.user: .school: Data is not object, got undefined',
      ])
    );
  });

  it('should validate object with optional fields correctly', () => {
    const schema = {
      name: avery.string(),
      age: avery.number().nullable(),
    };
    const validator = avery.object(schema);

    expectResultEqual(
      validator.validate({ name: 'John', age: 30 }),
      Ok({ name: 'John', age: 30 })
    );
    expectResultEqual(
      validator.validate({ name: 'John', age: null }),
      Ok({ name: 'John', age: null })
    );
    expectResultEqual(
      validator.validate({ name: 'John' }),
      Ok({ name: 'John', age: null })
    );
  });

  it('should validate object with additional properties correctly', () => {
    const schema = {
      name: avery.string(),
      age: avery.number(),
    };
    const validator = avery.object(schema);

    expectResultEqual(
      validator.validate({ name: 'John', age: 30, extra: 'extra' }),
      Ok({ name: 'John', age: 30 })
    );
  });

  it('should handle complex object validation correctly', () => {
    const schema = {
      name: avery.string().minLength(3).maxLength(10),
      age: avery.number().gt(18).lt(60),
    };
    const validator = avery.object(schema);

    expectResultEqual(
      validator.validate({ name: 'John', age: 30 }),
      Ok({ name: 'John', age: 30 })
    );
    expectResultEqual(
      validator.validate({ name: 'Jo', age: 30 }),
      Err(['.name: Value Jo is too short'])
    );
    expectResultEqual(
      validator.validate({ name: 'John', age: 17 }),
      Err(['.age: Value 17 is not greater than 18'])
    );
    expectResultEqual(
      validator.validate({ name: 'John', age: 60 }),
      Err(['.age: Value 60 is not less than 60'])
    );
    expectResultEqual(
      validator.validate({ name: 'This name is too long', age: 30 }),
      Err(['.name: Value This name is too long is too long'])
    );
  });
});
