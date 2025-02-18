import path from 'path'
import dts from 'vite-plugin-dts'
import { defineConfig } from 'vitest/config'
import react from '@vitejs/plugin-react-swc'

export default defineConfig({
  plugins: [react(), dts({ rollupTypes: true, tsconfigPath: './tsconfig.json' })],
  build: {
    lib: {
      entry: path.resolve(__dirname, 'src/index.ts'),
      formats: ['es', 'cjs'],
      fileName: (format) => `index.${format === 'es' ? 'mjs' : 'cjs'}`,
    },
    rollupOptions: {
      external: ['react', 'react-dom', 'react/jsx-runtime'],
      output: {
        globals: {
          react: 'React',
          'react-dom': 'ReactDOM',
        },
      },
    },
  },
  define: {
    'import.meta.vitest': undefined,
  },
  test: {
    globals: false,
    environment: 'jsdom',
    setupFiles: ['setup-tests.ts'],
    includeSource: ['src/**/*.{ts,tsx}'],
    coverage: {
      provider: 'v8',
      include: ['src/**/*.{ts,tsx}'],
      reporter: ['text', 'json', 'html'],
      exclude: ['src/**/*.test.{ts,tsx}', 'src/**/index.{ts,tsx}'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    },
  },
})
