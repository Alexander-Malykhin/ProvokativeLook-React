import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import path from 'node:path';

export default defineConfig({
    plugins: [
        react(),
    ],

    base: '/',

    resolve: {
        alias: {
            '@': path.resolve(import.meta.dirname, './src'),
            '@routes': path.resolve(import.meta.dirname, './src/routes'),
            '@scss': path.resolve(import.meta.dirname, './src/scss'),
            '@pages': path.resolve(import.meta.dirname, './src/pages'),
            '@components': path.resolve(import.meta.dirname, './src/components'),
            '@layouts': path.resolve(import.meta.dirname, './src/layouts'),
            '@store': path.resolve(import.meta.dirname, './src/store'),
            '@UI': path.resolve(import.meta.dirname, './src/UI'),
            '@assets': path.resolve(import.meta.dirname, './src/assets'),
            '@hooks': path.resolve(import.meta.dirname, './src/hooks'),
            '@helpers': path.resolve(import.meta.dirname, './src/helpers'),
            '@api': path.resolve(import.meta.dirname, './src/api'),
        },
    },

    css: {
        preprocessorOptions: {
            scss: {
                additionalData: `
                    @use "@scss/settings/fonts" as *;
                    @use "@scss/settings/colors" as *;
                    @use "@scss/settings/functions" as *;
                    @use "@scss/settings/mixins" as *;
                    @use "@scss/settings/containers" as *;
                `,
            },
        },
    },

    build: {
        outDir: 'dist',
        emptyOutDir: true,

        rollupOptions: {
            output: {
                entryFileNames: 'assets/[name]-[hash].js',
                chunkFileNames: 'assets/[name]-[hash].js',
                assetFileNames: 'assets/[name]-[hash][extname]',
            },
        },
    },

    server: {
        proxy: {
            '/local/api': {
                target: 'https://24.provokativelook.ru',
                changeOrigin: true,
                secure: false,
            },
        },
    },
});
