import { defineConfig } from 'tsdown';

export default defineConfig({
    entry: ['./src/index.ts', './src/vite.ts'],
    dts: {
        tsgo: true,
    },
    exports: true,
    // ...config options
});
