import { Err, Ok, Result } from './monad/result';
import { baseValidator, nullValidator } from './validator';

function _createValidator(func: (data: boolean) => Result<boolean, string[]>) {
  return baseValidator(func, {
    eq: (value: boolean) =>
      _createValidator((data) =>
        func(data).fmapErr((errs) =>
          value != data ? [...errs, `Value mismatch, expected ${value}`] : errs
        )
      ),
  });
}

export const createBooleanValidator = () =>
  _createValidator((data) =>
    typeof data === 'boolean'
      ? Ok(data)
      : Err([`Data is not boolean, got ${typeof data}`])
  );
