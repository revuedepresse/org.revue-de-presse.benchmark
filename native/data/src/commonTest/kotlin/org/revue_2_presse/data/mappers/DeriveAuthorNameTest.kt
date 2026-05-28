package org.revue_2_presse.data.mappers

import kotlin.test.Test
import kotlin.test.assertEquals

class DeriveAuthorNameTest {
    @Test fun strips_tld_and_capitalises() {
        assertEquals("Franceculture", DeriveAuthorName.from("franceculture.fr"))
    }
    @Test fun handles_multi_segment_tld() {
        assertEquals("News", DeriveAuthorName.from("news.bsky.social"))
    }
    @Test fun handles_blank_or_null_with_Inconnu() {
        assertEquals("Inconnu", DeriveAuthorName.from(""))
        assertEquals("Inconnu", DeriveAuthorName.from(null))
    }
    @Test fun preserves_internal_casing_after_capitalisation() {
        assertEquals("LeMonde", DeriveAuthorName.from("LeMonde.fr"))
    }
}
