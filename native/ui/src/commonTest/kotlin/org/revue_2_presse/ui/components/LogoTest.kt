package org.revue_2_presse.ui.components

import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import org.revue_2_presse.domain.i18n.RdpLocale
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class LogoTest {
    @Test fun renders_with_brand_alt_text() = runComposeUiTest {
        setContent { RdpTheme(locale = RdpLocale.FR_FR) { Logo() } }
        onNodeWithTag("Logo.image").assertIsDisplayed()
        onNodeWithContentDescription("Logo Revue de presse").assertIsDisplayed()
    }
}
