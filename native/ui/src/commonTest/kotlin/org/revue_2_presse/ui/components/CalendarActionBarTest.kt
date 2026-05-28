package org.revue_2_presse.ui.components

import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test
import kotlin.test.assertEquals

@OptIn(ExperimentalTestApi::class)
class CalendarActionBarTest {
    @Test fun prev_next_month_year_emit_callbacks() = runComposeUiTest {
        var prevClicks = 0
        var nextClicks = 0
        var monthClicks = 0
        var yearClicks = 0
        setContent {
            RdpTheme {
                CalendarActionBar(
                    monthLabel = "Mai",
                    yearLabel = "2026",
                    onPrev = { prevClicks++ },
                    onNext = { nextClicks++ },
                    onMonthClick = { monthClicks++ },
                    onYearClick = { yearClicks++ },
                )
            }
        }
        onNodeWithTag("CalendarActionBar.prev").performClick()
        onNodeWithTag("CalendarActionBar.next").performClick()
        onNodeWithTag("CalendarActionBar.month").performClick()
        onNodeWithTag("CalendarActionBar.year").performClick()
        assertEquals(1, prevClicks)
        assertEquals(1, nextClicks)
        assertEquals(1, monthClicks)
        assertEquals(1, yearClicks)
    }
}
