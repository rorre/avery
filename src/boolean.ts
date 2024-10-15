import { Result } from './monad/result';
import { nullValidator } from './validator';

export function createBooleanValidator(
  func: (data: boolean) => Result<boolean, string[]>
) {
  return {
    validate: func,
    is: (value: boolean) =>
      createBooleanValidator((data) =>
        func(data).fmapErr((errs) =>
          value != data ? [...errs, `Value mismatch, expected ${value}`] : errs
        )
      ),
    nullable: () => nullValidator(func),
  };
}
