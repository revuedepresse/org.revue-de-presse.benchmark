package org.revue_2_presse.data.auth

import kotlin.test.Test
import kotlin.test.assertEquals
import org.revue_2_presse.data.mappers.HydraToHighlight
import org.revue_2_presse.data.api.HydraCollection
import org.revue_2_presse.data.api.HydraHighlight

/**
 * Covers the LocalDateTime fallback branch in HydraToHighlight.parseDate
 * (dates without a Z suffix), which is the one missed line in HydraToHighlight.
 */
class HydraToHighlightParseTest {

    @Test fun maps_date_without_z_suffix_via_localDateTime_fallback() {
        val highlight = HydraHighlight(
            id = "/api/highlights/99",
            publicationId = "pub-99",
            screenName = "test.example.com",
            text = "Test body",
            reposts = 0,
            likes = 0,
            replies = 0,
            date = "2026-05-01T09:00:00",   // no trailing Z → triggers the fallback branch
            url = "https://bsky.app/profile/test.example.com/post/99",
        )
        val collection = HydraCollection(member = listOf(highlight))
        val result = HydraToHighlight.map(collection)
        assertEquals(1, result.size)
        // Epoch-seconds check: 2026-05-01T09:00:00Z = 1746090000
        assertEquals(1777626000L, result[0].publishedAt.epochSeconds)
    }
}
