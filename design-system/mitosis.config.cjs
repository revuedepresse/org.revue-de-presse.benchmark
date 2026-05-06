/**
 * Mitosis configuration: M1 ships React and Vue only.
 * M2 adds Svelte, Solid, Lit. M4 adds Angular, Qwik, Preact, Stencil, Alpine.
 */
module.exports = {
  files: 'src/components/**/*.lite.tsx',
  dest: 'output',
  exclude: ['**/node_modules/**'],
  options: {
    react: {
      typescript: true,
      stylesType: 'styled-jsx',
      stateType: 'useState',
    },
    vue: {
      typescript: true,
      api: 'composition',
    },
  },
  targets: ['react', 'vue'],
};
