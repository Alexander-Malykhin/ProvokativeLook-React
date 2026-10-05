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
                // Upstream Bitrix cookies belong to its domain; the browser receives them on localhost.
                cookieDomainRewrite: '',
                secure: false,
                configure: (proxy) => {
                    proxy.on('proxyRes', (response, request) => {
                        // Only the HTTP loopback dev server needs these cookie attributes adjusted.
                        if (!/^(localhost|127\.0\.0\.1)(:\d+)?$/i.test(request.headers.host ?? '')) return;
                        const cookies = response.headers['set-cookie'];
                        if (cookies) response.headers['set-cookie'] = cookies.map(cookie =>
                            cookie.replace(/;\s*Secure\b/gi, '').replace(/;\s*SameSite=None\b/gi, '; SameSite=Lax'));
                    });
                },
            },
        },
    },
});
