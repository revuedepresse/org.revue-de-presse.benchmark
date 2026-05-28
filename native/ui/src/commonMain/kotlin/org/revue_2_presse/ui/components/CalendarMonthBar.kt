package org.revue_2_presse.ui.components

import androidx.compose.foundation.layout.Row
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.style.TextAlign
import org.revue_2_presse.design.i18n.rdpString
import org.revue_2_presse.design.theme.LocalRdpType
import org.revue_2_presse.domain.i18n.RdpStrings

@Composable
fun CalendarMonthBar(modifier: Modifier = Modifier) {
    val type = LocalRdpType.current
    val keys = listOf(
        RdpStrings.Key.CalendarWeekdaysShortMonday,
        RdpStrings.Key.CalendarWeekdaysShortTuesday,
        RdpStrings.Key.CalendarWeekdaysShortWednesday,
        RdpStrings.Key.CalendarWeekdaysShortThursday,
        RdpStrings.Key.CalendarWeekdaysShortFriday,
        RdpStrings.Key.CalendarWeekdaysShortSaturday,
        RdpStrings.Key.CalendarWeekdaysShortSunday,
    )
    Row(modifier.testTag("CalendarMonthBar.root").fillMaxWidth()) {
        keys.forEach { k ->
            Text(rdpString(k), Modifier.weight(1f), textAlign = TextAlign.Center,
                 fontSize = type.FontSizeCalendarMonthDay)
        }
    }
}
