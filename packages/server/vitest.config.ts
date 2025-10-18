import { defineConfig } from "vitest/config";
import path from "path";

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
            $application: path.resolve(process.cwd(), "packages/server/src/application"),
            $config: path.resolve(process.cwd(), "packages/server/src/config"),
            $domain: path.resolve(process.cwd(), "packages/server/src/domain"),
            $infrastructure: path.resolve(process.cwd(), "packages/server/src/infrastructure"),
            $presentation: path.resolve(process.cwd(), "packages/server/src/presentation"),
            $types: path.resolve(process.cwd(), "packages/server/src/types"),
            $utils: path.resolve(process.cwd(), "packages/server/src/utils"),
        },
        conditions: mode === 'test' ? ['browser'] : [],
    }
}));