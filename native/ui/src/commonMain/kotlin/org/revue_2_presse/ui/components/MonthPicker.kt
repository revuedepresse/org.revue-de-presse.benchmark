package org.revue_2_presse.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.border
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.material3.HorizontalDivider
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.input.pointer.PointerIcon
import androidx.compose.ui.input.pointer.pointerHoverIcon
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.style.TextAlign
import androidx.compose.ui.unit.dp
import kotlinx.datetime.LocalDate
import org.revue_2_presse.design.RdpColors
import org.revue_2_presse.design.RdpRadii
import org.revue_2_presse.design.i18n.rdpString
import org.revue_2_presse.design.theme.LocalRdpSpacing
import org.revue_2_presse.domain.i18n.RdpStrings

// Nuxt parity: design-system/src/components/MonthPicker.lite.tsx — vertical list
// (not a grid), white surface, 1px Brand border, items with Brand text + Brand
// bottom border between them. Disabled (out-of-range) items render with
// LightGrey text on BackgroundOtherMonth bg and the cursor stays default.
@Composable
fun MonthPicker(
    year: Int,
    selected: Int,
    onSelect: (Int) -> Unit,
    modifier: Modifier = Modifier,
    minDate: LocalDate? = null,
    maxDate: LocalDate? = null,
) {
    val spacing = LocalRdpSpacing.current
    androidx.compose.foundation.layout.Column(
        modifier
            .testTag("MonthPicker.root")
            .fillMaxWidth()
            .clip(RoundedCornerShape(RdpRadii.Default))
            .border(1.dp, RdpColors.Brand, RoundedCornerShape(RdpRadii.Default))
            .background(RdpColors.White),
    ) {
        (1..12).forEach { idx ->
            val isSelected = idx == selected
            val disabled = isMonthDisabled(year, idx, minDate, maxDate)
            val rowModifier = Modifier
                .testTag("MonthPicker.cell.$idx")
                .fillMaxWidth()
                .background(
                    when {
                        isSelected -> RdpColors.Brand
                        disabled -> RdpColors.BackgroundOtherMonth
                        else -> RdpColors.White
                    },
                )
                .let { base ->
                    if (disabled) base
                    else base.pointerHoverIcon(PointerIcon.Hand).clickable { onSelect(idx) }
                }
                .padding(PaddingValues(horizontal = spacing.Separation2, vertical = spacing.Separation1))
            Box(rowModifier, contentAlignment = Alignment.CenterStart) {
                Text(
                    text = rdpString(monthKey(idx)),
                    color = when {
                        isSelected -> RdpColors.White
                        disabled -> RdpColors.LightGrey
                        else -> RdpColors.Brand
                    },
                    textAlign = TextAlign.Start,
                )
            }
            if (idx < 12) HorizontalDivider(thickness = 1.dp, color = RdpColors.Brand)
        }
    }
}

private fun isMonthDisabled(year: Int, month: Int, min: LocalDate?, max: LocalDate?): Boolean {
    if (min != null) {
        if (year < min.year) return true
        if (year == min.year && month < min.monthNumber) return true
    }
    if (max != null) {
        if (year > max.year) return true
        if (year == max.year && month > max.monthNumber) return true
    }
    return false
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
