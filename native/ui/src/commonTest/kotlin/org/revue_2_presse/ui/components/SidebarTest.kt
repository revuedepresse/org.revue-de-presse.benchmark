package org.revue_2_presse.ui.components

import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test
import kotlin.test.assertEquals

@OptIn(ExperimentalTestApi::class)
class SidebarTest {
    @Test fun renders_calendar_and_banner_with_nav_delegation() = runComposeUiTest {
        var navigatedTo: String? = null
        setContent { RdpTheme { Sidebar(onNavigate = { navigatedTo = it }) } }
        onNodeWithTag("Sidebar.root").assertIsDisplayed()
        onNodeWithTag("Calendar.root").assertIsDisplayed()
        onNodeWithTag("BannerAbout.root").assertIsDisplayed()
        onNodeWithTag("BannerAbout.viewButton.support").performClick()
        assertEquals("/nous-soutenir", navigatedTo)
    }
}
