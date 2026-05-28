package org.revue_2_presse.ui.components

import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.runtime.*
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import kotlinx.datetime.Clock
import kotlinx.datetime.DatePeriod
import kotlinx.datetime.LocalDate
import kotlinx.datetime.TimeZone
import kotlinx.datetime.minus
import kotlinx.datetime.plus
import kotlinx.datetime.todayIn
import org.revue_2_presse.design.theme.LocalRdpSpacing

private enum class CalendarMode { Date, Month, Year }

// Data archive starts here — selecting earlier days/months/years is disabled.
// Lifted to a top-level val so the same floor reaches DateGrid + MonthPicker + YearPicker.
private val ARCHIVE_FLOOR: LocalDate = LocalDate(2025, 3, 4)

@Composable
fun Calendar(
    initial: LocalDate,
    onSelect: (LocalDate) -> Unit,
    modifier: Modifier = Modifier,
) {
    val spacing = LocalRdpSpacing.current
    var visible by remember { mutableStateOf(initial) }
    var selected by remember { mutableStateOf(initial) }
    var mode by remember { mutableStateOf(CalendarMode.Date) }
    val monthLabel = visible.month.name.lowercase().replaceFirstChar { it.uppercaseChar() }
    val yearLabel = visible.year.toString()
    val today = remember { Clock.System.todayIn(TimeZone.of("Europe/Paris")) }
    // Next is enabled only when visible (year, month) < today's (year, month).
    val canGoNext = (visible.year < today.year) ||
        (visible.year == today.year && visible.monthNumber < today.monthNumber)
    // Prev is enabled only when visible is strictly later than the archive floor's month.
    val canGoPrev = (visible.year > ARCHIVE_FLOOR.year) ||
        (visible.year == ARCHIVE_FLOOR.year && visible.monthNumber > ARCHIVE_FLOOR.monthNumber)

    Column(modifier.testTag("Calendar.root"), verticalArrangement = Arrangement.spacedBy(spacing.Separation1)) {
        CalendarActionBar(
            monthLabel = monthLabel,
            yearLabel = yearLabel,
            onPrev = if (canGoPrev) {
                { visible = visible.minus(DatePeriod(months = 1)) }
            } else {
                {}
            },
            onNext = if (canGoNext) {
                { visible = visible.plus(DatePeriod(months = 1)) }
            } else {
                {}
            },
            prevEnabled = canGoPrev,
            nextEnabled = canGoNext,
            onMonthClick = {
                mode = if (mode == CalendarMode.Month) CalendarMode.Date else CalendarMode.Month
            },
            onYearClick = {
                mode = if (mode == CalendarMode.Year) CalendarMode.Date else CalendarMode.Year
            },
        )
        when (mode) {
            CalendarMode.Date -> {
                CalendarMonthBar()
                DateGrid(
                    year = visible.year,
                    month = visible.monthNumber,
                    selected = selected,
                    onSelect = { date ->
                        selected = date
                        onSelect(date)
                    },
                    lastAvailable = today.minus(DatePeriod(days = 1)),
                    minDate = ARCHIVE_FLOOR,
                )
            }
            CalendarMode.Month -> {
                MonthPicker(
                    year = visible.year,
                    selected = visible.monthNumber,
                    onSelect = { month ->
                        visible = LocalDate(visible.year, month, 1)
                        mode = CalendarMode.Date
                    },
                    minDate = ARCHIVE_FLOOR,
                    maxDate = today,
                )
            }
            CalendarMode.Year -> {
                YearPicker(
                    selected = visible.year,
                    // Inclusive range from the archive floor's year through today's
                    // year. Matches the Nuxt year picker which lists every year for
                    // which data exists.
                    range = ARCHIVE_FLOOR.year..today.year,
                    onSelect = { year ->
                        // Clamp the visible month to a valid one for the picked year
                        // when crossing into the archive floor's year.
                        val clampedMonth = when {
                            year == ARCHIVE_FLOOR.year && visible.monthNumber < ARCHIVE_FLOOR.monthNumber ->
                                ARCHIVE_FLOOR.monthNumber
                            year == today.year && visible.monthNumber > today.monthNumber -> today.monthNumber
                            else -> visible.monthNumber
                        }
                        visible = LocalDate(year, clampedMonth, 1)
                        mode = CalendarMode.Date
                    },
                )
            }
        }
    }
}
