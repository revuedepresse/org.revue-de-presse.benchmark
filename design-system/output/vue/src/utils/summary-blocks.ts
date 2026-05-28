// Block model for daily-summary markdown rendering. The parser that produces
// this shape lives in the Nuxt app (utils/parse-summary-markdown.ts) — the
// design-system stays presentation-only.
//
// Keep types in sync with org.revue-de-presse.benchmark/nuxt/utils/parse-summary-markdown.ts.

export type SummaryInlineSegment =
  | { kind: 'text'; value: string }
  | { kind: 'bold'; value: string }
  | { kind: 'handle'; value: string };

export type SummaryBlock =
  | { kind: 'paragraph'; segments: SummaryInlineSegment[] }
  | { kind: 'bullets'; items: SummaryInlineSegment[][] };
