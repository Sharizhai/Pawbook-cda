import { svelte, vitePreprocess } from "@sveltejs/vite-plugin-svelte"
import { paraglideVitePlugin } from '@inlang/paraglide-js'
import { defineConfig } from "vitest/config"
import path from "path"

export default defineConfig({
  plugins: [
    svelte({
      preprocess: vitePreprocess()
    }),
    paraglideVitePlugin({
      project: './project.inlang',
      outdir: './src/lib/paraglide'
    })
  ],
  test: {
    globals: true,
    environment: 'jsdom',
    include: ['src/**/*.test.ts'],
    coverage: {
      reporter: ['text', 'json', 'html'],
    }
  },
  resolve: {
    alias: {
      $public: path.resolve("./public"),
      $assets: path.resolve("./src/assets"),
      $components: path.resolve("./src/components"),
      $config: path.resolve("./src/config"),
      $data: path.resolve("./src/data"),
      $lib: path.resolve("./src/lib"),
      $pages: path.resolve("./src/pages"),
      $services: path.resolve("./src/services"),
      $stores: path.resolve("./src/stores"),
      $types: path.resolve("./src/types"),
      $utils: path.resolve("./src/utils"),
    },
  }
});