import { describe, expect, test } from 'vitest';
import { guardPlugin } from './guard.vite';

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
