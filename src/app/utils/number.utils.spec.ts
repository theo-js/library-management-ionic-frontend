import { NumberUtils } from './number.utils';

describe('NumberUtils', () => {
  describe('parseIntOrUndefined', () => {
    it('should return the parsed integer when given a valid number', () => {
      expect(NumberUtils.parseIntOrUndefined('123')).toBe(123);
    });

    it('should return undefined when given an invalid number', () => {
      expect(NumberUtils.parseIntOrUndefined('abc')).toBeUndefined();
    });

    it('should return 0 when given "0"', () => {
      expect(NumberUtils.parseIntOrUndefined('0')).toBe(0);
    });

    it('should return a negative number when given a negative number', () => {
      expect(NumberUtils.parseIntOrUndefined('-42')).toBe(-42);
    });

    it('should return undefined when given an empty string', () => {
      expect(NumberUtils.parseIntOrUndefined('')).toBeUndefined();
    });
  });
});
