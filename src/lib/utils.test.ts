import { describe, it, expect } from 'vitest';
import { makeId, clamp, isKeyOf } from './utils';

describe('makeId', () => {
  it('generates a non-empty string', () => {
    const id = makeId();
    expect(typeof id).toBe('string');
    expect(id.length).toBeGreaterThan(0);
  });

  it('generates unique ids', () => {
    const ids = new Set(Array.from({ length: 100 }, () => makeId()));
    expect(ids.size).toBe(100);
  });
});

describe('clamp', () => {
  it('returns value when within range', () => {
    expect(clamp(5, 0, 10)).toBe(5);
  });

  it('returns min when value is below', () => {
    expect(clamp(-5, 0, 10)).toBe(0);
  });

  it('returns max when value is above', () => {
    expect(clamp(15, 0, 10)).toBe(10);
  });

  it('handles equal bounds', () => {
    expect(clamp(5, 5, 5)).toBe(5);
  });
});

describe('isKeyOf', () => {
  it('returns true for existing key', () => {
    expect(isKeyOf('a', { a: 1, b: 2 })).toBe(true);
  });

  it('returns false for non-existing key', () => {
    expect(isKeyOf('c', { a: 1, b: 2 })).toBe(false);
  });
});
