import { Ok, Result } from './monad/result';

export type ValidateFunc<T, E> = (data: T) => Result<T, E>;

export interface Validator<T, E> {
  validate: (data: any) => Result<T, E>;
  nullable: () => Validator<T | null, E>;
}

export const nullValidator = <T, E>(func: ValidateFunc<T, E>) => ({
  validate: (data: any) =>
    (data == null ? Ok(null) : func(data)) as Result<T, E>,
  nullable: () => nullValidator(func),
});

export const baseValidator = <T, Additional extends Record<string, any>>(
  func: (data: any) => Result<T, string[]>,
  additional: Additional
): Validator<T, string[]> & Additional => ({
  validate: func,
  nullable: () => nullValidator(func),
  ...additional,
});
