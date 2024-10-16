export interface Result<T, E> {
  bind: <U>(fn: (val: T) => Result<U, E>) => Result<U, E>;
  fmap: <U>(fn: (val: T) => U) => Result<U, E>;
  fmapErr<F>(fn: (err: E) => F): Result<T, F>;
  expect: (message: string) => T;
  unwrap: () => T;
  unwrapErr: () => E;
  unwrapOr: <D extends T>(defaultValue: D) => D | T;
  isOk: () => boolean;
  isErr: () => boolean;
}

function createOk<T>(value: T): Result<T, never> {
  return {
    fmap: (transform) => createOk(transform(value)),
    fmapErr: (_) => createOk(value),
    bind: (transform) => transform(value),
    expect: (_) => value,
    unwrap: () => value,
    unwrapOr: (_) => value,
    isOk: () => true,
    isErr: () => false,
    unwrapErr: () => {
      throw new Error('Not an error!');
    },
  };
}

function createErr<E>(value: E): Result<never, E> {
  return {
    fmap: (_) => createErr(value),
    fmapErr: (transform) => createErr(transform(value)),
    bind: (_) => createErr(value),
    expect: (message) => {
      throw new Error(message);
    },
    unwrap: () => {
      throw new Error('This is an error');
    },
    unwrapOr: (defaultValue) => defaultValue,
    isOk: () => false,
    isErr: () => true,
    unwrapErr: () => value,
  };
}

export const Ok = createOk;
export const Err = createErr;
