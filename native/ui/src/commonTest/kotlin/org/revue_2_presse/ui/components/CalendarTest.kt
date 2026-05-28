package org.revue_2_presse.ui.components

import androidx.compose.runtime.*
import androidx.compose.ui.test.*
import kotlinx.datetime.LocalDate
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test
import kotlin.test.assertEquals

@OptIn(ExperimentalTestApi::class)
class CalendarTest {
    @Test fun navigating_prev_then_picking_emits_correct_date() = runComposeUiTest {
        var picked: LocalDate? = null
        setContent {
            RdpTheme {
                Calendar(initial = LocalDate(2026, 5, 28), onSelect = { picked = it })
            }
        }
        onNodeWithTag("CalendarActionBar.prev").performClick()      // April 2026
        onNodeWithTag("DateGrid.cell.2026-04-15").performClick()
        assertEquals(LocalDate(2026, 4, 15), picked)
    }
}
