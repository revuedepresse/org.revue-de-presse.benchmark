package org.revue_2_presse.domain.entities

import kotlinx.datetime.LocalDate
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class SourceTest {
    @Test fun source_is_value_class() {
        val a = Source("franceculture.fr", "France Culture", null, LocalDate(2022, 1, 14), 1247)
        val b = Source("franceculture.fr", "France Culture", null, LocalDate(2022, 1, 14), 1247)
        assertEquals(a, b)
    }

    @Test fun screen_name_required() {
        val ex = runCatching {
            Source("", "x", null, LocalDate(2022, 1, 1), 0)
        }.exceptionOrNull()
        assertTrue(ex is IllegalArgumentException)
    }

    @Test fun source_detail_holds_recent_highlights() {
        val src = Source("franceculture.fr", "France Culture", null, LocalDate(2022, 1, 14), 1247)
        val detail = SourceDetail(source = src, recentHighlights = emptyList())
        assertEquals(src, detail.source)
        assertEquals(0, detail.recentHighlights.size)
    }
}
