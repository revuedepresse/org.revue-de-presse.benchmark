package org.revue_2_presse.ui.components
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test
import kotlin.test.assertEquals

@OptIn(ExperimentalTestApi::class)
class WebIntentsTest {
    @Test fun open_button_emits_url() = runComposeUiTest {
        var opened: String? = null
        setContent { RdpTheme { WebIntents(url = "https://bsky.app/x", onOpen = { opened = it }, onShare = {}) } }
        onNodeWithTag("WebIntents.openButton").performClick()
        assertEquals("https://bsky.app/x", opened)
    }
    @Test fun share_button_emits_url() = runComposeUiTest {
        var shared: String? = null
        setContent { RdpTheme { WebIntents(url = "https://bsky.app/x", onOpen = {}, onShare = { shared = it }) } }
        onNodeWithTag("WebIntents.shareButton").performClick()
        assertEquals("https://bsky.app/x", shared)
    }
}
