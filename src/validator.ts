import { Ok, Result } from './monad/result';

export type ValidateFunc<T, E> = (data: T) => Result<T, E>;

export interface Validator<T, E> {
  validate: (data: T) => Result<T, E>;
  nullable: () => Validator<T | null, E>;
}

export const nullValidator = <T, E>(func: ValidateFunc<T, E>) => ({
  validate: (data: T | null) => (data == null ? Ok(null) : func(data)),
  nullable: () => nullValidator(func),
});

export const baseValidator = <T, Additional extends Record<string, any>>(
  func: (data: T) => Result<T, string[]>,
  additional: Additional
) => ({
  validate: func,
  nullable: () => nullValidator(func),
  ...additional,
});
