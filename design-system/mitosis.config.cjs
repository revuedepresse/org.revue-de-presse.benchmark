/**
 * Mitosis configuration: Vue-only emit (consumed by the Nuxt app).
 */
module.exports = {
  files: 'src/components/**/*.lite.tsx',
  dest: 'output',
  exclude: ['**/node_modules/**'],
  options: {
    vue: { typescript: true, api: 'composition' },
  },
  targets: ['vue'],
};
