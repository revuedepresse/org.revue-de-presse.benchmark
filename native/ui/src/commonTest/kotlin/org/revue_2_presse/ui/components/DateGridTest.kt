package org.revue_2_presse.ui.components

import androidx.compose.ui.test.*
import kotlinx.datetime.LocalDate
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test
import kotlin.test.assertEquals

@OptIn(ExperimentalTestApi::class)
class DateGridTest {
    @Test fun emits_LocalDate_on_cell_click() = runComposeUiTest {
        var picked: LocalDate? = null
        setContent {
            RdpTheme {
                DateGrid(year = 2026, month = 5, selected = null, onSelect = { picked = it })
            }
        }
        onNodeWithTag("DateGrid.cell.2026-05-15").performClick()
        assertEquals(LocalDate(2026, 5, 15), picked)
    }

    @Test fun marks_other_month_cells_with_distinct_styling() = runComposeUiTest {
        setContent {
            RdpTheme { DateGrid(year = 2026, month = 5, selected = null, onSelect = {}) }
        }
        // May 2026 starts on Friday; first row contains Apr 27,28,29,30 + May 1,2,3
        onNodeWithTag("DateGrid.cell.2026-04-27.otherMonth").assertExists()
    }
}
