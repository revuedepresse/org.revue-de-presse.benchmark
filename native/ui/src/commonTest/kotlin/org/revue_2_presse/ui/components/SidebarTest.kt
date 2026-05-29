package org.revue_2_presse.ui.components

import androidx.compose.ui.semantics.SemanticsActions
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
        // The banner is taller than the test canvas (Play Store badge + section
        // margins), so the support button lands off-screen. Drive its registered
        // OnClick semantics action directly — this verifies nav delegation
        // without requiring the node to be scrolled into view.
        onNodeWithTag("BannerAbout.viewButton.support").performSemanticsAction(SemanticsActions.OnClick)
        assertEquals("/nous-soutenir", navigatedTo)
    }
}
