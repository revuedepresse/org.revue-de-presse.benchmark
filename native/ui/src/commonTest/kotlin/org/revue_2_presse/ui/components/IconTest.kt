package org.revue_2_presse.ui.components

import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class IconTest {
    @Test fun renders_known_icon() = runComposeUiTest {
        setContent { RdpTheme { RdpIcon(name = "close") } }
        onNodeWithTag("Icon.close").assertIsDisplayed()
    }

    @Test fun unknown_icon_is_silent() = runComposeUiTest {
        setContent { RdpTheme { RdpIcon(name = "nonexistent-glyph") } }
        // assertion: composition doesn't crash.
    }
}
