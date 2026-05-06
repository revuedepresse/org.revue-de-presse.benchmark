/**
 * Mitosis configuration: M2 ships React, Vue, Svelte, Solid, Lit.
 * M4 adds Angular, Qwik, Preact, Stencil, Alpine.
 */
module.exports = {
  files: 'src/components/**/*.lite.tsx',
  dest: 'output',
  exclude: ['**/node_modules/**'],
  options: {
    react: { typescript: true, stylesType: 'styled-jsx', stateType: 'useState' },
    vue: { typescript: true, api: 'composition' },
    svelte: { typescript: true },
    solid: { typescript: true },
    lit: { typescript: true },
  },
  targets: ['react', 'vue', 'svelte', 'solid', 'lit'],
};
