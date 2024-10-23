import { Err, Ok, Result } from './monad/result';
import { baseValidator, nullValidator } from './validator';

function _createValidator(func: (data: string) => Result<string, string[]>) {
  return baseValidator(func, {
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
  });
}

export function createStringValidator() {
  return _createValidator((data) =>
    typeof data === 'string'
      ? Ok(data)
      : Err([`Data is not string, received ${typeof data}`])
  );
}
