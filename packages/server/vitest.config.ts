import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig({
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
            '$application': path.join(__dirname, 'src/application'),
            '$config': path.join(__dirname, 'src/config'),
            '$domain': path.join(__dirname, 'src/domain'),
            '$infrastructure': path.join(__dirname, 'src/infrastructure'),
            '$presentation': path.join(__dirname, 'src/presentation'),
            '$types': path.join(__dirname, 'src/types'),
            '$utils': path.join(__dirname, 'src/utils'),
        },
        extensions: ['.ts', '.js', '.json'],
    },
});