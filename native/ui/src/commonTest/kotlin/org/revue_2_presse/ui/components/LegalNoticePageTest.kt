package org.revue_2_presse.ui.components
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import org.revue_2_presse.domain.i18n.RdpLocale
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class LegalNoticePageTest {
    @Test fun renders_title_via_static_surface() = runComposeUiTest {
        setContent { RdpTheme(locale = RdpLocale.FR_FR) { LegalNoticePage() } }
        onNodeWithTag("LegalNoticePage.root").assertIsDisplayed()
        onNodeWithText("Politique de confidentialité").assertIsDisplayed()
    }
}
