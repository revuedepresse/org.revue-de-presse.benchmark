package org.revue_2_presse.ui.components

import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test
import kotlin.test.assertEquals

@OptIn(ExperimentalTestApi::class)
class BannerAboutTest {
    @Test fun renders_sections_and_fires_view_navigation() = runComposeUiTest {
        var navigatedTo: String? = null
        setContent { RdpTheme { BannerAbout(onNavigate = { navigatedTo = it }) } }
        onNodeWithTag("BannerAbout.root").assertIsDisplayed()
        onNodeWithTag("BannerAbout.title.about").assertIsDisplayed()
        onNodeWithTag("BannerAbout.viewButton.sources").performClick()
        assertEquals("/sources", navigatedTo)
    }
}
