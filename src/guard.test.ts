import { describe, expect, test } from 'vitest';
import { guard, guardNull } from './guard';

describe('guard', () => {
    test('does not throw when condition is truthy', () => {
        expect(() => guard(true, 'value must exist')).not.toThrow();
    });

    test('throws the provided message when condition is falsy', () => {
        expect(() => guard(false, 'value must exist')).toThrow(
            'Guard failed: value must exist',
        );
    });
});

describe('guardNull', () => {
    test('does not throw when condition is truthy', () => {
        expect(() => guardNull({ id: 1 })).not.toThrow();
    });

    test('throws with fallback name when condition is falsy', () => {
        expect(() => guardNull(null)).toThrow(
            'Guard failed: value must not be null',
        );
    });

    test('throws with provided name when condition is falsy', () => {
        expect(() => guardNull(undefined, 'user')).toThrow(
            'Guard failed: user must not be null',
        );
    });
});
