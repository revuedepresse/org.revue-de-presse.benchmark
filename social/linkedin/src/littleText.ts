// LinkedIn LITTLE_TEXT format escape helper.
//
// The /rest/posts `commentary` field is parsed as LITTLE_TEXT. Reserved
// characters that are NOT part of a supported element/template (MentionElement
// `@[Text](urn:...)`, HashtagElement `#word`, HashtagTemplate
// `{hashtag|#|word}`) must be backslash-escaped, otherwise LinkedIn truncates
// the post at the first malformed token. We observed this on 2026-05-25 05:30
// Paris: the digest contained `(J'ai du mal à trouver...)` in entry #1, the
// parser tried to read a Urn inside the parens, failed, and only entry #1 was
// rendered to viewers (the post was created and returned a URN — the
// truncation is silent).
//
// We intentionally leave `#` un-escaped so plain `#Hashtag` keeps rendering as
// a clickable HashtagElement.
//
// Spec: https://learn.microsoft.com/en-us/linkedin/marketing/community-management/shares/little-text-format

const RESERVED = /[\\|{}@[\]()<>*_~]/g;

export function escapeLittleText(text: string): string {
  return text.replace(RESERVED, (c) => '\\' + c);
}
