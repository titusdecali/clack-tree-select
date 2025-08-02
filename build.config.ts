import { defineBuildConfig } from 'unbuild';

export default defineBuildConfig({
  entries: ['src/index'],
  declaration: true,
  clean: true,
  rollup: {
    emitCJS: false,
    dts: {
      respectExternal: true,
    },
  },
  externals: ['@clack/core', 'picocolors', 'sisteransi', 'node:fs', 'node:path'],
});