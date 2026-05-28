package org.revue_2_presse.ui.components

import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test
import kotlin.test.assertEquals

@OptIn(ExperimentalTestApi::class)
class MonthPickerTest {
    @Test fun emits_month_index_on_click() = runComposeUiTest {
        var picked = -1
        setContent { RdpTheme { MonthPicker(selected = 5, onSelect = { picked = it }) } }
        onNodeWithTag("MonthPicker.cell.7").performClick()
        assertEquals(7, picked)
    }
}
