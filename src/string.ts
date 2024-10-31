import { Err, Ok, Result } from './monad/result';
import { baseValidator, createCheck, Validator } from './validator';

function _createValidator(
  func: (data: string) => Result<string, string[]>
): Validator<string, string[]> & {
  minLength: (n: number) => ReturnType<typeof _createValidator>;
  maxLength: (n: number) => ReturnType<typeof _createValidator>;
} {
  return baseValidator(func, {
    minLength: (n: number) =>
      _createValidator((data) =>
        createCheck(
          (res) => (res.length < n ? `Value ${res} is too short` : null),
          func(data)
        )
      ),
    maxLength: (n: number) =>
      _createValidator((data) =>
        createCheck(
          (res) => (res.length > n ? `Value ${res} is too long` : null),
          func(data)
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
