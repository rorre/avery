import { Err, Ok, Result } from './monad/result';
import { nullValidator } from './validator';

function _createValidator(func: (data: string) => Result<string, string[]>) {
  return {
    validate: func,
    minLength: (n: number) =>
      _createValidator((data) =>
        func(data).fmapErr((errs) =>
          data.length < n ? [...errs, `Minimum length is ${n}`] : errs
        )
      ),
    maxLength: (n: number) =>
      _createValidator((data) =>
        func(data).fmapErr((errs) =>
          data.length > n ? [...errs, `Maximum length is ${n}`] : errs
        )
      ),
    nullable: () => nullValidator(func),
  };
}

export const createStringValidator = () =>
  _createValidator((data) =>
    typeof data === 'string'
      ? Ok(data)
      : Err([`Data is not string, received ${typeof data}`])
  );
