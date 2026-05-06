// Shared per-target metadata for emit-presence assertions.
// Centralised so adding/removing a Mitosis target only edits this file.

export const TARGETS = [
  { name: 'react',   ext: 'tsx' },
  { name: 'vue',     ext: 'vue' },
  { name: 'svelte',  ext: 'svelte' },
  { name: 'solid',   ext: 'tsx' },
  { name: 'lit',     ext: 'ts' },
  { name: 'angular', ext: 'ts' },
  { name: 'qwik',    ext: 'tsx' },
  { name: 'preact',  ext: 'tsx' },
  { name: 'stencil', ext: 'tsx' },
  { name: 'alpine',  ext: 'html' },
] as const;

export type Target = (typeof TARGETS)[number];
