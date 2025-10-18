import { defineConfig } from "vitest/config";
import tsconfigPaths from 'vitest-tsconfig-paths';

export default defineConfig({
    plugins: [tsconfigPaths()],
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
});