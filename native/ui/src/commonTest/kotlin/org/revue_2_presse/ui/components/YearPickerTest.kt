package org.revue_2_presse.ui.components
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test
import kotlin.test.assertEquals

@OptIn(ExperimentalTestApi::class)
class YearPickerTest {
    @Test fun emits_year_on_click() = runComposeUiTest {
        var picked = -1
        setContent { RdpTheme { YearPicker(selected = 2026, range = 2020..2026, onSelect = { picked = it }) } }
        onNodeWithTag("YearPicker.cell.2024").performClick()
        assertEquals(2024, picked)
    }
}
