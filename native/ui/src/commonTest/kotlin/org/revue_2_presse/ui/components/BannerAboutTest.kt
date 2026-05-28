package org.revue_2_presse.ui.components
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test
import kotlin.test.assertTrue

@OptIn(ExperimentalTestApi::class)
class BannerAboutTest {
    @Test fun renders_about_message_and_fires_click() = runComposeUiTest {
        var clicked = false
        setContent { RdpTheme { BannerAbout(onClick = { clicked = true }) } }
        onNodeWithTag("BannerAbout.root").assertIsDisplayed().performClick()
        assertTrue(clicked)
    }
}
