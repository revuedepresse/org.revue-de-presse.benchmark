package org.revue_2_presse.design.theme

import androidx.compose.material3.Text
import androidx.compose.ui.test.ExperimentalTestApi
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.runComposeUiTest
import org.revue_2_presse.domain.i18n.RdpLocale
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class RdpThemeTest {
    @Test fun theme_supplies_locale_to_children() = runComposeUiTest {
        setContent {
            RdpTheme(locale = RdpLocale.FR_FR) {
                val locale = LocalRdpLocale.current
                Text("locale=${locale.tag}")
            }
        }
        onNodeWithText("locale=fr-FR").assertIsDisplayed()
    }
}
