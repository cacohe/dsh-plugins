import type { UserConfig } from 'tsdown'

const packageId = 'dsh-quick-buttons'

export default [
  {
    name: packageId,
    entry: { index: 'src/index.ts' },
    outDir: 'lib',
    format: 'esm',
    platform: 'node',
    target: 'node22',
    clean: true,
    dts: true,
    sourcemap: true,
    outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
  },
  {
    name: `${packageId}/client`,
    entry: { client: 'src/client/index.tsx' },
    outDir: 'lib',
    format: 'cjs',
    platform: 'browser',
    target: 'es2022',
    clean: false,
    dts: false,
    sourcemap: true,
    deps: {
      neverBundle: ['react', 'react/jsx-runtime'],
    },
    outExtensions: () => ({ js: '.js', dts: '.d.ts' }),
    outputOptions: {
      entryFileNames: 'client.js',
      banner: `window.__ModuleLoader__.load({ id: ${JSON.stringify(packageId)}, factory: (require) => {`,
      footer: 'return module.exports; } });',
      intro: 'var module = { exports: {} }; var exports = module.exports;',
    },
  },
] satisfies UserConfig[]
