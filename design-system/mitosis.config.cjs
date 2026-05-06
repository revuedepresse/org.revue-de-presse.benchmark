/**
 * Mitosis configuration: M4 ships all 10 spec targets.
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
    angular: { typescript: true },
    qwik: { typescript: true },
    preact: { typescript: true, stylesType: 'styled-jsx' },
    stencil: { typescript: true },
    alpine: {},
  },
  targets: [
    'react',
    'vue',
    'svelte',
    'solid',
    'lit',
    'angular',
    'qwik',
    'preact',
    'stencil',
    'alpine',
  ],
};
