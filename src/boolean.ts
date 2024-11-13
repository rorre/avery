import { Err, Ok, Result } from './monad/result';
import { baseValidator, runCheck, Validator } from './validator';

function _createValidator(
  func: (data: boolean) => Result<boolean, string[]>
): Validator<boolean, string[]> & {
  eq: (value: boolean) => ReturnType<typeof _createValidator>;
} {
  return baseValidator(func, {
    eq: (value: boolean) =>
      _createValidator((data) =>
        runCheck(
          (res) =>
            res != value ? `Value ${res} does not equal ${value}` : null,
          func(data)
        )
      ),
  });
}

export function createBooleanValidator() {
  return _createValidator((data) =>
    typeof data === 'boolean'
      ? Ok(data)
      : Err([`Data is not boolean, got ${typeof data}`])
  );
}
