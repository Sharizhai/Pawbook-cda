import { defineConfig } from "vitest/config";
import path from "path";

export default defineConfig(({ mode }) =>({
    test: {
        globals: true,
        environment: 'node',
        pool: 'forks',
        poolOptions: {
            forks: {
                singleFork: true,
            },
        },
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
            $application: path.resolve("./src/application"),
            $config: path.resolve("./src/config"),
            $domain: path.resolve("./src/domain"),
            $infrastructure: path.resolve("./src/infrastructure"),
            $presentation: path.resolve("./src/presentation"),
            $types: path.resolve("./src/types"),
            $utils: path.resolve("./src/utils"),
        },
        conditions: mode === 'test' ? ['browser'] : [],
    }
}));