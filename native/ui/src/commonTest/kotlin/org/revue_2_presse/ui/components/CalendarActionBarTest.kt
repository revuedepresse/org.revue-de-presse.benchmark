package org.revue_2_presse.ui.components
import androidx.compose.ui.test.*
import org.revue_2_presse.design.theme.RdpTheme
import kotlin.test.Test
import kotlin.test.assertEquals

@OptIn(ExperimentalTestApi::class)
class CalendarActionBarTest {
    @Test fun prev_and_next_buttons_emit_callbacks() = runComposeUiTest {
        var prevClicks = 0
        var nextClicks = 0
        setContent {
            RdpTheme {
                CalendarActionBar(
                    monthLabel = "Mai 2026",
                    onPrev = { prevClicks++ },
                    onNext = { nextClicks++ },
                )
            }
        }
        onNodeWithTag("CalendarActionBar.prev").performClick()
        onNodeWithTag("CalendarActionBar.next").performClick()
        assertEquals(1, prevClicks); assertEquals(1, nextClicks)
    }
}
