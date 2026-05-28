package org.revue_2_presse.data.mappers

import kotlinx.serialization.json.Json
import org.revue_2_presse.data.api.HydraCollection
import org.revue_2_presse.data.api.HydraHighlight
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class HydraToHighlightTest {
    private val json = Json { ignoreUnknownKeys = true }

    private fun loadFixture(name: String): String =
        this::class.java.classLoader!!
            .getResourceAsStream("fixtures/$name")!!
            .bufferedReader().readText()

    @Test fun maps_collection_to_3_highlights() {
        val payload = json.decodeFromString<HydraCollection<HydraHighlight>>(
            loadFixture("hydra-highlights-fr-2026-05-01.json")
        )
        val mapped = HydraToHighlight.map(payload)
        assertEquals(3, mapped.size)
    }

    @Test fun strips_surrounding_quotes_from_body() {
        val payload = json.decodeFromString<HydraCollection<HydraHighlight>>(
            loadFixture("hydra-highlights-fr-2026-05-01.json")
        )
        val first = HydraToHighlight.map(payload).first()
        assertTrue(!first.body.startsWith("\""))
        assertTrue(!first.body.endsWith("\""))
    }

    @Test fun derives_author_name_from_handle() {
        val payload = json.decodeFromString<HydraCollection<HydraHighlight>>(
            loadFixture("hydra-highlights-fr-2026-05-01.json")
        )
        val first = HydraToHighlight.map(payload).first()
        assertEquals("Franceculture", first.authorName)
    }

    @Test fun preserves_metrics_unchanged() {
        val payload = json.decodeFromString<HydraCollection<HydraHighlight>>(
            loadFixture("hydra-highlights-fr-2026-05-01.json")
        )
        val first = HydraToHighlight.map(payload).first()
        assertEquals(127, first.metrics.likes)
        assertEquals(80, first.metrics.reposts)
    }
}
