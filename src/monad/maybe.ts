export interface Maybe<T> {
  bind: <U, F extends (value: T) => Maybe<U>>(transform: F) => Maybe<U>;
  get(): T;
  getOrDefault(defaultValue: T): T;
}

function createSome<T>(value: T): Maybe<T> {
  return {
    bind: (transform) => transform(value),
    get: () => value,
    getOrDefault: (_) => value,
  };
}

function createNone<T>(): Maybe<T> {
  return {
    bind: (_) => createNone(),
    get: () => {
      throw new Error('This is a none');
    },
    getOrDefault: (defaultValue) => defaultValue,
  };
}

export function maybe<T>(value: T | null): Maybe<T> {
  return value === null || value === undefined
    ? createNone()
    : createSome(value);
}

export const None = createNone;
export const Some = createSome;
