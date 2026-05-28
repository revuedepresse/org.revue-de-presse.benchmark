package org.revue_2_presse.data.mappers

import kotlin.test.Test
import kotlin.test.assertEquals

class CleanTextTest {

    // ── repairMojibake ──────────────────────────────────────────────────────

    @Test fun repair_mojibake_a_grave() {
        // Ã© → é  (UTF-8 0xC3 0xA9 decoded as Latin-1)
        assertEquals("Café", CleanText.repairMojibake("CafÃ©"))
    }

    @Test fun repair_mojibake_e_umlaut() {
        // Ã« → ë
        assertEquals("Israël", CleanText.repairMojibake("IsraÃ«l"))
    }

    @Test fun repair_mojibake_multiple_sequences() {
        assertEquals("L'Humanité attaquée", CleanText.repairMojibake("L'HumanitÃ© attaquÃ©e"))
    }

    @Test fun repair_mojibake_leaves_valid_utf8_untouched() {
        val s = "Café déjà-vu — émoji 🌷"
        assertEquals(s, CleanText.repairMojibake(s))
    }

    @Test fun repair_mojibake_leaves_plain_ascii_untouched() {
        assertEquals("hello world", CleanText.repairMojibake("hello world"))
    }

    @Test fun repair_mojibake_refuses_when_char_beyond_latin1_present() {
        // Emoji present → can't safely repair → leave alone
        assertEquals("🌷 CafÃ©", CleanText.repairMojibake("🌷 CafÃ©"))
    }

    @Test fun repair_mojibake_returns_empty_for_empty_input() {
        assertEquals("", CleanText.repairMojibake(""))
    }

    // ── cleanText — mojibake ────────────────────────────────────────────────

    @Test fun clean_repairs_mojibake_before_other_transforms() {
        // Wrapped in literal quotes + mojibake'd accent
        assertEquals("Café", CleanText.clean("\"CafÃ©\""))
    }

    // ── cleanText — surrounding literal straight-quotes ─────────────────────

    @Test fun clean_strips_surrounding_literal_quotes() {
        assertEquals("On pense au muguet", CleanText.clean("\"On pense au muguet\""))
    }

    @Test fun clean_does_not_strip_when_no_surrounding_quotes() {
        assertEquals("bonjour", CleanText.clean("bonjour"))
    }

    // ── cleanText — literal \n → real LF ───────────────────────────────────

    @Test fun clean_converts_literal_backslash_n_to_linefeed() {
        assertEquals("line1\nline2", CleanText.clean("line1\\nline2"))
    }

    // ── cleanText — escaped quotes ──────────────────────────────────────────

    @Test fun clean_decodes_escaped_single_quote() {
        assertEquals("L'Espagne", CleanText.clean("L\\'Espagne"))
    }

    @Test fun clean_decodes_escaped_double_quote() {
        assertEquals("\"Atlantique\"", CleanText.clean("\\\"Atlantique\\\""))
    }

    // ── cleanText — 4-hex-digit \xNNNN[\\] escapes ─────────────────────────

    @Test fun clean_decodes_x202f_narrow_no_break_space_to_space() {
        // NARROW NO-BREAK SPACE (U+202F) before colon
        assertEquals("connue : attaquer", CleanText.clean("connue\\x202f\\: attaquer"))
    }

    @Test fun clean_decodes_x2026_horizontal_ellipsis() {
        assertEquals("voir aussi…", CleanText.clean("voir aussi\\x2026"))
    }

    @Test fun clean_decodes_x2007_figure_space_to_space() {
        assertEquals("valeur 42", CleanText.clean("valeur\\x2007\\42"))
    }

    @Test fun clean_drops_x0000_control_codepoint() {
        // U+0000 is in control range → drop
        assertEquals("ab", CleanText.clean("a\\x0000b"))
    }

    // ── cleanText — 2-hex-digit \xNN[\\] escapes ────────────────────────────

    @Test fun clean_does_not_confuse_xa0_with_four_digit_form() {
        // 2-digit nbsp: `\xa0\` between `1er` and `mai`
        assertEquals("1er mai", CleanText.clean("1er\\xa0\\mai"))
    }

    @Test fun clean_decodes_xa0_nbsp_to_space() {
        assertEquals("a b", CleanText.clean("a\\xa0b"))
    }

    @Test fun clean_decodes_printable_ascii_2digit_escape() {
        // \x2f = '/'
        assertEquals("a/b", CleanText.clean("a\\x2fb"))
    }

    @Test fun clean_drops_non_printable_2digit_escape() {
        // \x01 is control → drop
        assertEquals("ab", CleanText.clean("a\\x01b"))
    }

    // ── cleanText — CSS-style \NN[\\] hex (no x prefix) ────────────────────

    @Test fun clean_decodes_css_hex_2f_to_slash() {
        // \2f\ → /
        assertEquals("a/b", CleanText.clean("a\\2f\\b"))
    }

    @Test fun clean_decodes_css_hex_3a_to_colon() {
        // \3a\ → :
        assertEquals("a:b", CleanText.clean("a\\3a\\b"))
    }

    @Test fun clean_drops_css_hex_for_non_printable() {
        // \01\ → drop
        assertEquals("ab", CleanText.clean("a\\01\\b"))
    }

    // ── cleanText — 4-digit year-shaped artefacts ───────────────────────────

    @Test fun clean_4digit_decimal_artefact_css_step_eats_first_two_digits() {
        // CSS step (\NN[\]) consumes \20 (→ space, printable 0x20), leaving 24b.
        // The TS spec: step 5 (CSS hex) runs before step 6 (4-digit decimal),
        // so \2024\ resolves to " 24b" not a drop.
        assertEquals("a 24b", CleanText.clean("a\\2024\\b"))
    }

    @Test fun clean_4digit_artefact_without_trailing_backslash_css_step_partial() {
        // \19 → 0x19 (non-printable) → drop by CSS step; 99 remains as literal text.
        assertEquals("a99b", CleanText.clean("a\\1999b"))
    }

    // ── cleanText — variation selectors and zero-width chars ────────────────

    @Test fun clean_strips_variation_selector_fe0f() {
        // U+FE0F is a variation selector
        assertEquals("ok", CleanText.clean("ok️"))
    }

    @Test fun clean_strips_variation_selector_fe0e() {
        assertEquals("ok", CleanText.clean("ok︎"))
    }

    @Test fun clean_strips_zero_width_space() {
        // U+200B zero-width space
        assertEquals("ok", CleanText.clean("ok​"))
    }

    // ── cleanText — bare backslash ───────────────────────────────────────────

    @Test fun clean_strips_remaining_bare_backslash() {
        assertEquals("ab", CleanText.clean("a\\b"))
    }

    // ── cleanText — whitespace collapsing and trim ───────────────────────────

    @Test fun clean_trims_leading_and_trailing_whitespace() {
        assertEquals("texte", CleanText.clean("   texte   "))
    }

    @Test fun clean_collapses_multiple_spaces_to_one() {
        assertEquals("a b", CleanText.clean("a  b"))
    }

    @Test fun clean_collapses_mixed_spaces_and_tabs() {
        assertEquals("a b", CleanText.clean("a \t b"))
    }

    @Test fun clean_handles_empty_string() {
        assertEquals("", CleanText.clean(""))
    }

    @Test fun clean_handles_blank_string() {
        assertEquals("", CleanText.clean("   "))
    }

    // ── cleanForFeed ─────────────────────────────────────────────────────────

    @Test fun clean_for_feed_repairs_mojibake_and_flattens_line_feeds() {
        assertEquals("L'Humanité est debout", CleanText.cleanForFeed("L'HumanitÃ©\nest\rdebout"))
    }

    @Test fun clean_for_feed_collapses_multiple_line_feeds() {
        assertEquals("a b", CleanText.cleanForFeed("a\n\nb"))
    }

    @Test fun clean_for_feed_flattens_real_lf_from_backslash_n_artefact() {
        assertEquals("line1 line2", CleanText.cleanForFeed("line1\\nline2"))
    }
}
