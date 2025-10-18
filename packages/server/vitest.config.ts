import { defineConfig } from "vitest/config";
import path from "path";
import { fileURLToPath } from 'url';

// Détection de __dirname pour ESM/CJS
const __filename = typeof __filename !== 'undefined'
    ? __filename
    : fileURLToPath(import.meta.url);
const __dirname = typeof __dirname !== 'undefined'
    ? __dirname
    : path.dirname(__filename);

export default defineConfig(({ mode }) =>({
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
            $application: path.resolve(__dirname, "./src/application"),
            $config: path.resolve(__dirname, "./src/config"),
            $domain: path.resolve(__dirname, "./src/domain"),
            $infrastructure: path.resolve(__dirname, "./src/infrastructure"),
            $presentation: path.resolve(__dirname, "./src/presentation"),
            $types: path.resolve(__dirname, "./src/types"),
            $utils: path.resolve(__dirname, "./src/utils"),
        },
        conditions: mode === 'test' ? ['browser'] : [],
    }
}));