import { describe, expect, test } from 'vitest';
import { guard, guardNull, guardPlugin } from './guard';

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

describe('guardPlugin', () => {
    test('injects guardNull argument name in development mode', async () => {
        const plugin = guardPlugin();
        plugin.configResolved({ mode: 'development' });

        const result = await plugin.transform(
            'const user = getUser();\nguardNull(user);\nconsole.log(user.id);',
            'src/user.ts',
        );

        expect(result).toMatchObject({
            code: 'const user = getUser();\nguardNull(user, "user");\nconsole.log(user.id);',
        });
    });

    test('removes guard calls in production mode', async () => {
        const plugin = guardPlugin() as any;
        plugin.configResolved({ mode: 'production' });

        const result = await plugin.transform(
            'const user = getUser();\nguard(user, "user must exist");\nguardNull(user);\nconsole.log(user.id);',
            'src/user.ts',
        );

        expect(result).toMatchObject({
            code: 'const user = getUser();\n;\n;\nconsole.log(user.id);',
        });
    });

    test('skips files that cannot contain guard calls', async () => {
        const plugin = guardPlugin() as any;
        plugin.configResolved({ mode: 'development' });

        const result = await plugin.transform(
            'const user = getUser();\nconsole.log(user.id);',
            'src/user.ts',
        );

        expect(result).toBeNull();
    });
});
