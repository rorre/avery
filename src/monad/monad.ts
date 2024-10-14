interface Monad<T> {
  bind: <U, F extends (value: T) => Monad<U>>(transform: F) => ReturnType<F>;
}
