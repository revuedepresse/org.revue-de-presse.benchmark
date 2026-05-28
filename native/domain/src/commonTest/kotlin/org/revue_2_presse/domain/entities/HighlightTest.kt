package org.revue_2_presse.domain.entities

import kotlinx.datetime.Instant
import kotlin.test.Test
import kotlin.test.assertEquals
import kotlin.test.assertTrue

class HighlightTest {

    @Test
    fun equality_is_value_based() {
        val a = Highlight(
            id = "at://did:plc:abc/post/123",
            authorName = "France Culture",
            authorHandle = "franceculture.fr",
            authorAvatarUrl = "https://cdn.bsky.app/avatar.jpg",
            body = "On pense au muguet",
            publishedAt = Instant.parse("2026-05-01T04:00:00Z"),
            metrics = Metrics(replies = 0, reposts = 80, likes = 127),
            url = "https://bsky.app/profile/franceculture.fr/post/123",
        )
        val b = a.copy()
        assertEquals(a, b)
    }

    @Test
    fun metrics_default_to_zero() {
        val m = Metrics()
        assertEquals(0, m.replies)
        assertEquals(0, m.reposts)
        assertEquals(0, m.likes)
    }

    @Test
    fun id_must_not_be_blank() {
        val ex = runCatching {
            Highlight(
                id = "",
                authorName = "x", authorHandle = "x", authorAvatarUrl = null,
                body = "", publishedAt = Instant.DISTANT_PAST,
                metrics = Metrics(), url = "https://x",
            )
        }.exceptionOrNull()
        assertTrue(ex is IllegalArgumentException, "expected IAE, got $ex")
    }
}
