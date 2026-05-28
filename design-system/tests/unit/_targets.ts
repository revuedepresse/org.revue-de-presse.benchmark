// Shared per-target metadata for emit-presence assertions.
// Centralised so adding/removing a Mitosis target only edits this file.

export const TARGETS = [
  { name: 'vue', ext: 'vue' },
] as const;

export type Target = (typeof TARGETS)[number];
