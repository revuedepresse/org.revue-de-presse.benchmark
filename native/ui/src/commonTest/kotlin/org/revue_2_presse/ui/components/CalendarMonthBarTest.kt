package org.revue_2_presse.ui.components

import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import org.revue_2_presse.domain.i18n.RdpLocale
import kotlin.test.Test

@OptIn(ExperimentalTestApi::class)
class CalendarMonthBarTest {
    @Test fun renders_7_weekday_labels_starting_monday_fr() = runComposeUiTest {
        setContent { RdpTheme(locale = RdpLocale.FR_FR) { CalendarMonthBar() } }
        onNodeWithTag("CalendarMonthBar.root").assertIsDisplayed()
        listOf("Lun.", "Mar.", "Mer.", "Jeu.", "Ven.", "Sam.", "Dim.").forEach {
            onNodeWithText(it).assertIsDisplayed()
        }
    }
}
