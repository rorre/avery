import { describe, it, expect } from 'bun:test';
import { Ok, Err, Result } from '../src/monad/result';

describe('Result Monad', () => {
  describe('Ok', () => {
    it('should return true for isOk', () => {
      const result: Result<number, string> = Ok<number, string>(42);
      expect(result.isOk()).toBe(true);
    });

    it('should return false for isErr', () => {
      const result: Result<number, string> = Ok<number, string>(42);
      expect(result.isErr()).toBe(false);
    });

    it('should unwrap the value', () => {
      const result: Result<number, string> = Ok<number, string>(42);
      expect(result.unwrap()).toBe(42);
    });

    it('should throw an error when unwrapErr is called', () => {
      const result: Result<number, string> = Ok<number, string>(42);
      expect(() => result.unwrapErr()).toThrow('Not an error!');
    });

    it('should transform the value using fmap', () => {
      const result: Result<number, string> = Ok<number, string>(42).fmap(
        (x) => x + 1
      );
      expect(result.unwrap()).toBe(43);
    });

    it('should bind the value using bind', () => {
      const result: Result<number, string> = Ok<number, string>(42).bind((x) =>
        Ok<number, string>(x + 1)
      );
      expect(result.unwrap()).toBe(43);
    });

    it('should return the default value with unwrapOr', () => {
      const result: Result<number, string> = Ok<number, string>(42);
      expect(result.unwrapOr(0)).toBe(42);
    });
  });

  describe('Err', () => {
    it('should return false for isOk', () => {
      const result: Result<number, string> = Err('error');
      expect(result.isOk()).toBe(false);
    });

    it('should return true for isErr', () => {
      const result: Result<number, string> = Err('error');
      expect(result.isErr()).toBe(true);
    });

    it('should throw an error when unwrap is called', () => {
      const result: Result<number, string> = Err('error');
      expect(() => result.unwrap()).toThrow('This is an error! Err: error');
    });

    it('should unwrap the error value', () => {
      const result: Result<number, string> = Err('error');
      expect(result.unwrapErr()).toBe('error');
    });

    it('should transform the error using fmapErr', () => {
      const result: Result<number, string> = Err<number, string>(
        'error'
      ).fmapErr((err) => err + '!');
      expect(result.unwrapErr()).toBe('error!');
    });

    it('should return the default value with unwrapOr', () => {
      const result: Result<number, string> = Err('error');
      expect(result.unwrapOr(0)).toBe(0);
    });

    it('should throw an error with the message', () => {
      const result: Result<number, string> = Err('error');
      expect(() => result.expect('This is an error!')).toThrow(
        'This is an error!'
      );
    });
  });
});
