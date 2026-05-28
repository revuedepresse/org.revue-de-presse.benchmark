// Block model for daily-summary markdown rendering. The parser that produces
// this shape lives in the Nuxt app (utils/parse-summary-markdown.ts) — the
// design-system stays presentation-only.
//
// Keep types in sync with org.revue-de-presse.benchmark/nuxt/utils/parse-summary-markdown.ts.

export type SummaryInlineSegment =
  | { kind: 'text'; value: string }
  | { kind: 'bold'; value: string };

export type SummaryBlock =
  | { kind: 'heading'; level: 1 | 2 | 3; segments: SummaryInlineSegment[] }
  | { kind: 'paragraph'; segments: SummaryInlineSegment[] }
  | { kind: 'bullets'; items: SummaryInlineSegment[][] };
