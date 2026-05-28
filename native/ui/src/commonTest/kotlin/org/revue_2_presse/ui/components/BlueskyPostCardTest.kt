package org.revue_2_presse.ui.components

import androidx.compose.ui.test.*
import kotlinx.datetime.Instant
import org.revue_2_presse.design.theme.RdpTheme
import org.revue_2_presse.domain.entities.Highlight
import org.revue_2_presse.domain.entities.Metrics
import kotlin.test.Test
import kotlin.test.assertTrue

@OptIn(ExperimentalTestApi::class)
class BlueskyPostCardTest {

    private fun fixture() = Highlight(
        id = "at://x", authorName = "France Culture", authorHandle = "franceculture.fr",
        authorAvatarUrl = "https://cdn.bsky.app/x.jpg",
        body = "On pense au muguet", publishedAt = Instant.parse("2026-05-01T04:00:00Z"),
        metrics = Metrics(replies = 12, reposts = 80, likes = 127),
        url = "https://bsky.app/x",
    )

    @Test fun renders_author_handle_body_and_metrics() = runComposeUiTest {
        setContent { RdpTheme { BlueskyPostCard(post = fixture()) } }
        onNodeWithTag("BlueskyPostCard.root").assertIsDisplayed()
        onNodeWithTag("BlueskyPostCard.authorHandle").assertTextContains("@franceculture.fr")
        onNodeWithTag("BlueskyPostCard.body").assertTextContains("On pense au muguet")
        onNodeWithTag("MetricsBar.root").assertIsDisplayed()
    }

    @Test fun bluesky_mark_emits_share_callback() = runComposeUiTest {
        var shared = false
        setContent { RdpTheme { BlueskyPostCard(post = fixture(), onShareClick = { shared = true }) } }
        onNodeWithTag("BlueskyPostCard.blueskyMark").performClick()
        assertTrue(shared)
    }
}
