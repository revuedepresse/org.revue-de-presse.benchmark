package org.revue_2_presse.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import kotlinx.datetime.DatePeriod
import kotlinx.datetime.LocalDate
import kotlinx.datetime.minus
import kotlinx.datetime.plus
import org.revue_2_presse.design.theme.LocalRdpSpacing

@Composable
fun Calendar(
    initial: LocalDate,
    onSelect: (LocalDate) -> Unit,
    modifier: Modifier = Modifier,
) {
    val spacing = LocalRdpSpacing.current
    var visible by remember { mutableStateOf(initial) }
    val monthLabel = "${visible.month.name.lowercase().replaceFirstChar { it.uppercaseChar() }} ${visible.year}"

    Column(modifier.testTag("Calendar.root"), verticalArrangement = Arrangement.spacedBy(spacing.Separation1)) {
        CalendarActionBar(
            monthLabel = monthLabel,
            onPrev = { visible = visible.minus(DatePeriod(months = 1)) },
            onNext = { visible = visible.plus(DatePeriod(months = 1)) },
        )
        CalendarMonthBar()
        DateGrid(
            year = visible.year,
            month = visible.monthNumber,
            selected = initial,
            onSelect = onSelect,
        )
    }
}
