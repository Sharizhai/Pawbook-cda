import { defineConfig } from "vitest/config";
import path from "path";

const isCI = process.env.CI === 'true';

const getAbsolutePath = (relativePath: string) => {
    if (isCI) {
        // Chemins absolus pour CircleCI
        return `/home/circleci/project/packages/server/${relativePath}`;
    }
    // Chemins relatifs pour local
    return path.resolve(__dirname, relativePath);
};

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
            '$application': getAbsolutePath('src/application'),
            '$config': getAbsolutePath('src/config'),
            '$domain': getAbsolutePath('src/domain'),
            '$infrastructure': getAbsolutePath('src/infrastructure'),
            '$presentation': getAbsolutePath('src/presentation'),
            '$types': getAbsolutePath('src/types'),
            '$utils': getAbsolutePath('src/utils'),
        },
        extensions: ['.ts', '.js', '.json'],
    },
});