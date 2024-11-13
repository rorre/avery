import { expect } from 'bun:test';
import { Result } from '../src/monad/result';

export function expectResultEqual<T, E>(
  value: Result<T, E>,
  expected: Result<T, E>
) {
  expect(value.isOk()).toBe(expected.isOk());
  if (value.isOk()) {
    expect(value.unwrap()).toEqual(expected.unwrap());
  } else {
    expect(value.unwrapErr()).toEqual(expected.unwrapErr());
  }
}
