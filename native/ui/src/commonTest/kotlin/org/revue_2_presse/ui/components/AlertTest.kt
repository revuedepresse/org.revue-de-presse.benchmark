package org.revue_2_presse.ui.components

import androidx.compose.material3.Text
import androidx.compose.ui.test.ExperimentalTestApi
import androidx.compose.ui.test.assertIsDisplayed
import androidx.compose.ui.test.onNodeWithTag
import androidx.compose.ui.test.onNodeWithText
import androidx.compose.ui.test.runComposeUiTest
import org.revue_2_presse.design.theme.RdpTheme
import org.revue_2_presse.domain.i18n.RdpLocale
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class AlertTest {

    @Test fun renders_message_in_info_variant() = runComposeUiTest {
        setContent {
            RdpTheme(locale = RdpLocale.FR_FR) {
                Alert(variant = AlertVariant.Info) { Text("Nouvel article disponible") }
            }
        }
        onNodeWithTag("Alert.root").assertIsDisplayed()
        onNodeWithText("Nouvel article disponible").assertIsDisplayed()
    }

    @Test fun warning_variant_carries_distinct_tag() = runComposeUiTest {
        setContent {
            RdpTheme(locale = RdpLocale.FR_FR) {
                Alert(variant = AlertVariant.Warning) { Text("hors-ligne") }
            }
        }
        onNodeWithTag("Alert.root--warning").assertIsDisplayed()
    }
}
