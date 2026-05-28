package org.revue_2_presse.ui.components
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class SidebarTest {
    @Test fun renders_4_nav_entries() = runComposeUiTest {
        setContent { RdpTheme { Sidebar(currentRoute = "/", onNavigate = {}) } }
        onNodeWithTag("Sidebar.root").assertIsDisplayed()
        listOf("/", "/sources", "/nous-contacter", "/nous-soutenir").forEach {
            onNodeWithTag("Sidebar.item.$it").assertIsDisplayed()
        }
    }
}
