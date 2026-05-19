import { describe, expect, test, vi } from 'vitest';
import { combine } from '.';

describe('combine', () => {
    test('calls all functions', () => {
        const fn1 = vi.fn();
        const fn2 = vi.fn();
        const fn3 = vi.fn();

        const combined = combine(fn1, fn2, fn3);

        combined();

        expect(fn1).toHaveBeenCalledOnce();
        expect(fn2).toHaveBeenCalledOnce();
        expect(fn3).toHaveBeenCalledOnce();
    });

    test('calls functions in order', () => {
        const calls: number[] = [];

        const combined = combine(
            () => calls.push(1),
            () => calls.push(2),
            () => calls.push(3),
        );

        combined();

        expect(calls).toEqual([1, 2, 3]);
    });

    test('works with no functions', () => {
        const combined = combine();

        expect(() => combined()).not.toThrow();
    });

    test('can be called multiple times', () => {
        const fn = vi.fn();

        const combined = combine(fn);

        combined();
        combined();
        combined();

        expect(fn).toHaveBeenCalledTimes(3);
    });

    test('preserves side effects from all functions', () => {
        let count = 0;

        const combined = combine(
            () => {
                count += 1;
            },
            () => {
                count += 2;
            },
            () => {
                count += 3;
            },
        );

        combined();

        expect(count).toBe(6);
    });
});
