package org.revue_2_presse.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp
import org.revue_2_presse.design.i18n.rdpString
import org.revue_2_presse.domain.i18n.RdpStrings

@Composable
fun MonthPicker(selected: Int, onSelect: (Int) -> Unit, modifier: Modifier = Modifier) {
    val monthLabels = (1..12).map { idx -> idx to rdpString(monthKey(idx)) }
    LazyVerticalGrid(GridCells.Fixed(3), modifier.testTag("MonthPicker.root"),
                     contentPadding = PaddingValues(8.dp)) {
        items(monthLabels.size) { i ->
            val (idx, label) = monthLabels[i]
            Box(Modifier.aspectRatio(1.5f).clickable { onSelect(idx) }.testTag("MonthPicker.cell.$idx"),
                contentAlignment = Alignment.Center) {
                Text(label)
            }
        }
    }
}

private fun monthKey(month: Int) = when (month) {
    1 -> RdpStrings.Key.CalendarMonthsShortJanuary
    2 -> RdpStrings.Key.CalendarMonthsShortFebruary
    3 -> RdpStrings.Key.CalendarMonthsShortMarch
    4 -> RdpStrings.Key.CalendarMonthsShortApril
    5 -> RdpStrings.Key.CalendarMonthsShortMay
    6 -> RdpStrings.Key.CalendarMonthsShortJune
    7 -> RdpStrings.Key.CalendarMonthsShortJuly
    8 -> RdpStrings.Key.CalendarMonthsShortAugust
    9 -> RdpStrings.Key.CalendarMonthsShortSeptember
    10 -> RdpStrings.Key.CalendarMonthsShortOctober
    11 -> RdpStrings.Key.CalendarMonthsShortNovember
    12 -> RdpStrings.Key.CalendarMonthsShortDecember
    else -> error("invalid month $month")
}
