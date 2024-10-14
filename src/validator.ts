import { Result } from './monad/result';

export interface Validator<T, E> {
  validate: (data: T) => Result<T, E>;
}
