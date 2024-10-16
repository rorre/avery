import { Err, Ok, Result } from './monad/result';
import { baseValidator } from './validator';

function _createValidator(func: (data: number) => Result<number, string[]>) {
  return baseValidator(func, {
    eq: (value: number) =>
      _createValidator((data) =>
        func(data).fmapErr((errs) =>
          value != data ? [...errs, `Value mismatch, expected ${value}`] : errs
        )
      ),
    gt: (value: number) =>
      _createValidator((data) =>
        func(data).fmapErr((errs) =>
          value > data
            ? errs
            : [...errs, `Value ${data} is not greater than ${value}`]
        )
      ),
    gte: (value: number) =>
      _createValidator((data) =>
        func(data).fmapErr((errs) =>
          value > data
            ? errs
            : [...errs, `Value ${data} is not greater than or equal ${value}`]
        )
      ),
    lt: (value: number) =>
      _createValidator((data) =>
        func(data).fmapErr((errs) =>
          value < data
            ? errs
            : [...errs, `Value ${data} is not less than ${value}`]
        )
      ),
    lte: (value: number) =>
      _createValidator((data) =>
        func(data).fmapErr((errs) =>
          value <= data
            ? errs
            : [...errs, `Value ${data} is not less than or equal ${value}`]
        )
      ),
  });
}

export const createNumberValidator = () =>
  _createValidator((data) =>
    typeof data === 'number'
      ? Ok(data)
      : Err([`Data is not number, got ${typeof data}`])
  );
