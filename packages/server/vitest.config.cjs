const { defineConfig } = require("vitest/config");
const path = require("path");

module.exports = defineConfig({
    test: {
        globals: true,
        environment: 'node',
        include: [
            "src/__tests__/**/*.{test,spec}.{ts,js}"
        ],
        coverage: {
            reporter: ["text", "json", "html"],
            provider: 'istanbul',
            exclude: [
                'node_modules/**',
                '**/*.d.ts',
            ]
        },
        watch: false,
        setupFiles: ["./setup-tests.ts"],
    },
    resolve: {
        alias: {
            '$application': path.resolve(__dirname, 'src/application'),
            '$config': path.resolve(__dirname, 'src/config'),
            '$domain': path.resolve(__dirname, 'src/domain'),
            '$infrastructure': path.resolve(__dirname, 'src/infrastructure'),
            '$presentation': path.resolve(__dirname, 'src/presentation'),
            '$types': path.resolve(__dirname, 'src/types'),
            '$utils': path.resolve(__dirname, 'src/utils'),
        },
        extensions: ['.ts', '.js', '.json'],
    },
});