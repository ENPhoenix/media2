import { parseCoordinates, formatCoordinates } from '../coordinates.js';

describe('parseCoordinates', () => {
  test('should parse coordinates with space after comma', () => {
    const result = parseCoordinates('51.50851, −0.12572');
    expect(result).toEqual({
      latitude: 51.50851,
      longitude: -0.12572,
    });
  });

  test('should parse coordinates without space after comma', () => {
    const result = parseCoordinates('51.50851,−0.12572');
    expect(result).toEqual({
      latitude: 51.50851,
      longitude: -0.12572,
    });
  });

  test('should parse coordinates with square brackets', () => {
    const result = parseCoordinates('[51.50851, −0.12572]');
    expect(result).toEqual({
      latitude: 51.50851,
      longitude: -0.12572,
    });
  });

  test('should parse coordinates with square brackets and no space', () => {
    const result = parseCoordinates('[51.50851,−0.12572]');
    expect(result).toEqual({
      latitude: 51.50851,
      longitude: -0.12572,
    });
  });

  test('should throw error for invalid format - no comma', () => {
    expect(() => parseCoordinates('51.50851 -0.12572')).toThrow('Invalid format: expected two coordinates separated by comma');
  });

  test('should throw error for invalid format - too many parts', () => {
    expect(() => parseCoordinates('51.50851, -0.12572, 123')).toThrow('Invalid format: expected two coordinates separated by comma');
  });

  test('should throw error for non-numeric coordinates', () => {
    expect(() => parseCoordinates('abc, def')).toThrow('Invalid format: coordinates must be numbers');
  });

  test('should throw error for invalid latitude > 90', () => {
    expect(() => parseCoordinates('91.0, 0.0')).toThrow('Invalid latitude: must be between -90 and 90');
  });

  test('should throw error for invalid latitude < -90', () => {
    expect(() => parseCoordinates('-91.0, 0.0')).toThrow('Invalid latitude: must be between -90 and 90');
  });

  test('should throw error for invalid longitude > 180', () => {
    expect(() => parseCoordinates('0.0, 181.0')).toThrow('Invalid longitude: must be between -180 and 180');
  });

  test('should throw error for invalid longitude < -180', () => {
    expect(() => parseCoordinates('0.0, -181.0')).toThrow('Invalid longitude: must be between -180 and 180');
  });

  test('should throw error for empty string', () => {
    expect(() => parseCoordinates('')).toThrow('Invalid input: expected string');
  });

  test('should throw error for null input', () => {
    expect(() => parseCoordinates(null)).toThrow('Invalid input: expected string');
  });

  test('should throw error for undefined input', () => {
    expect(() => parseCoordinates(undefined)).toThrow('Invalid input: expected string');
  });

  test('should handle coordinates with extra spaces', () => {
    const result = parseCoordinates('  51.50851  ,  −0.12572  ');
    expect(result).toEqual({
      latitude: 51.50851,
      longitude: -0.12572,
    });
  });

  test('should handle negative coordinates without special minus sign', () => {
    const result = parseCoordinates('51.50851, -0.12572');
    expect(result).toEqual({
      latitude: 51.50851,
      longitude: -0.12572,
    });
  });
});

describe('formatCoordinates', () => {
  test('should format coordinates correctly', () => {
    const result = formatCoordinates(51.50851, -0.12572);
    expect(result).toBe('[51.50851, -0.12572]');
  });

  test('should round to 5 decimal places', () => {
    const result = formatCoordinates(51.508512345, -0.125721234);
    expect(result).toBe('[51.50851, -0.12572]');
  });
});
