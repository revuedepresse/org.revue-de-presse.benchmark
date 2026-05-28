package org.revue_2_presse.data.mappers

/**
 * Port of nuxt/utils/clean-text.ts.
 *
 * Provides three functions that mirror the TypeScript originals:
 *   - [repairMojibake]  — fixes Ã©/Ã¨/etc. Latin-1-decoded UTF-8
 *   - [clean]           — full artefact-stripping pipeline (= cleanText in TS)
 *   - [cleanForFeed]    — [clean] + flatten line feeds (for RSS)
 */
object CleanText {

    // ── repairMojibake ───────────────────────────────────────────────────────

    /**
     * Repairs mojibake: a string whose characters are UTF-8 bytes that have
     * been mistakenly decoded as Latin-1, so `é` (UTF-8 0xC3 0xA9) appears
     * as `Ã©`. Detects the pattern and round-trips through Latin-1 bytes →
     * UTF-8. Aborts if any character is outside the Latin-1 range (e.g. emoji),
     * since that means the string is already valid UTF-8.
     */
    fun repairMojibake(text: String): String {
        if (text.isEmpty()) return ""
        // Quick sniff: `Ã` (0xC3) or `Â` (0xC2) followed by a UTF-8
        // continuation byte decoded as Latin-1 (U+0080..U+00BF).
        val hasMojibakeSignature = run {
            var found = false
            for (i in 0 until text.length - 1) {
                val c = text[i]
                if (c == 'Ã' || c == 'Â') {
                    val next = text[i + 1].code
                    if (next in 0x80..0xBF) { found = true; break }
                }
            }
            found
        }
        if (!hasMojibakeSignature) return text
        // Abort if any codepoint is outside the Latin-1 range (real UTF-8 present).
        for (c in text) {
            if (c.code > 0xFF) return text
        }
        // Round-trip: treat each Char as a Latin-1 byte and decode as UTF-8.
        val bytes = ByteArray(text.length) { text[it].code.toByte() }
        return try {
            bytes.toString(Charsets.UTF_8)
        } catch (_: Exception) {
            text
        }
    }

    // ── cleanText ────────────────────────────────────────────────────────────

    /**
     * Strips upstream encoding artefacts from raw status text (port of
     * `cleanText` in nuxt/utils/clean-text.ts). Transformations applied in
     * order:
     *
     *  0. Repair mojibake (Ã©/Ã¨/etc.) so later steps see real codepoints.
     *  1. Strip the literal straight-quote wrapping every upstream status.
     *  2. Convert literal `\n` (backslash-n in JSON payload) to real LF.
     *  3. Decode escaped quotes: `\'` → `'`, `\"` → `"`.
     *  3b. Decode 4-hex-digit `\xNNNN[\]` escapes (must run before 2-digit).
     *      NNBSP (U+202F), NBSP (U+00A0), figure space (U+2007) → regular space.
     *      Control chars dropped; other codepoints decoded to their char.
     *  4. Decode 2-hex-digit `\xNN[\]` escapes.
     *      nbsp (0xA0) → space; printable ASCII decoded; rest dropped.
     *  5. CSS-style `\NN[\]` hex escapes (no `x` prefix). Printable ASCII only.
     *  6. Drop 4-digit decimal year-shaped artefacts: `\NNNN[\]`.
     *  7. Strip Unicode variation selectors (U+FE0E, U+FE0F) and zero-width
     *     chars (U+200B–U+200D, U+2060).
     *  8. Strip any remaining bare backslash.
     *  9. Collapse runs of spaces/tabs to a single space.
     * 10. Trim.
     */
    fun clean(text: String): String {
        if (text.isEmpty()) return ""

        // 0. Repair mojibake.
        var out = repairMojibake(text)

        // 1. Strip surrounding literal straight-quotes.
        if (out.length >= 2 && out.first() == '"' && out.last() == '"') {
            out = out.substring(1, out.length - 1)
        }

        // 2. Literal `\n` → real LF.
        out = out.replace("\\n", "\n")

        // 3. Escaped quotes.
        out = out.replace("\\'", "'").replace("\\\"", "\"")

        // 3b. 4-hex-digit `\xNNNN[\]` (must run before the 2-digit step).
        out = replaceAll(out, Regex("""\\x([0-9a-fA-F]{4})\\?""")) { mr ->
            val code = mr.groupValues[1].toInt(16)
            when {
                code == 0xA0 || code == 0x2007 || code == 0x202F -> " "
                code < 0x20 || (code >= 0x7F && code < 0xA0) -> ""
                else -> try { code.toChar().toString() } catch (_: Exception) { "" }
            }
        }

        // 4. 2-hex-digit `\xNN[\]`.
        out = replaceAll(out, Regex("""\\x([0-9a-fA-F]{2})\\?""")) { mr ->
            val code = mr.groupValues[1].toInt(16)
            when {
                code == 0xA0 -> " "
                code >= 0x20 && code < 0x7F -> code.toChar().toString()
                else -> ""
            }
        }

        // 5. CSS-style `\NN[\]` (no x prefix). Printable ASCII only.
        out = replaceAll(out, Regex("""\\([0-9a-fA-F]{2})\\?""")) { mr ->
            val code = mr.groupValues[1].toInt(16)
            if (code >= 0x20 && code < 0x7F) code.toChar().toString() else ""
        }

        // 6. Drop 4-digit decimal year-shaped artefacts.
        out = out.replace(Regex("""\\[0-9]{4}\\?"""), "")

        // 7. Strip variation selectors (U+FE0E, U+FE0F) and zero-width chars
        //    (U+200B–U+200D range covers ZWS/ZWNJ/ZWJ; U+2060 word joiner).
        out = out.replace(Regex("""[​-‍︎️⁠]"""), "")

        // 8. Strip remaining bare backslashes.
        out = out.replace("\\", "")

        // 9. Collapse runs of spaces/tabs.
        out = out.replace(Regex("""[ \t]{2,}"""), " ")

        // 10. Trim.
        return out.trim()
    }

    // ── cleanForFeed ─────────────────────────────────────────────────────────

    /**
     * Variant for RSS feed output: [clean] then flatten line feeds to single
     * spaces and re-collapse runs. Mirrors `cleanForFeed` in clean-text.ts.
     */
    fun cleanForFeed(text: String): String =
        clean(text)
            .replace(Regex("""[\r\n]+"""), " ")
            .replace(Regex("""[ \t]{2,}"""), " ")
            .trim()

    // ── helpers ──────────────────────────────────────────────────────────────

    /**
     * Kotlin's [String.replace(Regex, transform)] requires API 24 on Android.
     * This helper works in commonMain for all targets.
     */
    private fun replaceAll(
        input: String,
        regex: Regex,
        transform: (MatchResult) -> String,
    ): String {
        val sb = StringBuilder()
        var last = 0
        for (mr in regex.findAll(input)) {
            sb.append(input, last, mr.range.first)
            sb.append(transform(mr))
            last = mr.range.last + 1
        }
        sb.append(input, last, input.length)
        return sb.toString()
    }
}
