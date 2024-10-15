import { Result } from './monad/result';
import { nullValidator } from './validator';

export function createStringValidator(
  func: (data: string) => Result<string, string[]>
) {
  return {
    validate: func,
    minLength: (n: number) =>
      createStringValidator((data) =>
        func(data).fmapErr((errs) =>
          data.length < n ? [...errs, `Minimum length is ${n}`] : errs
        )
      ),
    maxLength: (n: number) =>
      createStringValidator((data) =>
        func(data).fmapErr((errs) =>
          data.length > n ? [...errs, `Maximum length is ${n}`] : errs
        )
      ),
    nullable: () => nullValidator(func),
  };
}
