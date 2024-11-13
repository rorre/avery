import { Err, Ok, Result } from './monad/result';
import { baseValidator, runCheck, Validator } from './validator';

function _createValidator(
  func: (data: number) => Result<number, string[]>
): Validator<number, string[]> & {
  eq: (n: number) => ReturnType<typeof _createValidator>;
  lt: (n: number) => ReturnType<typeof _createValidator>;
  lte: (n: number) => ReturnType<typeof _createValidator>;
  gt: (n: number) => ReturnType<typeof _createValidator>;
  gte: (n: number) => ReturnType<typeof _createValidator>;
  int: () => ReturnType<typeof _createValidator>;
  finite: () => ReturnType<typeof _createValidator>;
} {
  return baseValidator(func, {
    eq: (value: number) =>
      _createValidator((data) =>
        runCheck(
          (res) =>
            res != value ? `Value ${res} does not equal ${value}` : null,
          func(data)
        )
      ),
    gt: (value: number) =>
      _createValidator((data) =>
        runCheck(
          (res) =>
            res <= value ? `Value ${res} is not greater than ${value}` : null,
          func(data)
        )
      ),
    gte: (value: number) =>
      _createValidator((data) =>
        runCheck(
          (res) =>
            res < value
              ? `Value ${res} is not greater than or equal to ${value}`
              : null,
          func(data)
        )
      ),
    lt: (value: number) =>
      _createValidator((data) =>
        runCheck(
          (res) =>
            res >= value ? `Value ${res} is not less than ${value}` : null,
          func(data)
        )
      ),
    lte: (value: number) =>
      _createValidator((data) =>
        runCheck(
          (res) =>
            res > value
              ? `Value ${res} is not less than or equal to ${value}`
              : null,
          func(data)
        )
      ),
    int: () =>
      _createValidator((data) =>
        runCheck(
          (val) =>
            !Number.isInteger(val) ? `Value ${val} is not an integer` : null,
          func(data)
        )
      ),
    finite: () =>
      _createValidator((data) =>
        runCheck(
          (val) =>
            !Number.isFinite(val) ? `Value ${val} is not finite` : null,
          func(data)
        )
      ),
  });
}

export function createNumberValidator() {
  return _createValidator((data) =>
    typeof data === 'number'
      ? Ok(data)
      : Err([`Data is not number, got ${typeof data}`])
  );
}
