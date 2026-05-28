package org.revue_2_presse.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.shape.RoundedCornerShape
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
import kotlinx.datetime.DatePeriod
import kotlinx.datetime.LocalDate
import kotlinx.datetime.minus
import kotlinx.datetime.plus
import org.revue_2_presse.design.theme.LocalRdpRadii
import org.revue_2_presse.design.RdpColors

@Composable
fun DateGrid(
    year: Int,
    month: Int,
    selected: LocalDate?,
    onSelect: (LocalDate) -> Unit,
    modifier: Modifier = Modifier,
    // Last day whose snapshot has been published. Cells past this date are
    // visually disabled (light-grey text, no hand cursor, no click). Defaults
    // to the selected cell when no separate ceiling is supplied — the Nuxt
    // sidebar uses "yesterday" as both selected and ceiling.
    lastAvailable: LocalDate? = selected,
    // First day for which a snapshot exists in the archive. Cells before this
    // date are likewise disabled. null = no floor.
    minDate: LocalDate? = null,
) {
    val radii = LocalRdpRadii.current
    val firstOfMonth = LocalDate(year, month, 1)
    val daysFromMondayBeforeFirst = firstOfMonth.dayOfWeek.ordinal
    val gridStart = firstOfMonth.minus(DatePeriod(days = daysFromMondayBeforeFirst))
    val cells = (0 until 42).map { gridStart.plus(DatePeriod(days = it)) }

    LazyVerticalGrid(GridCells.Fixed(7), modifier.testTag("DateGrid.root")) {
        items(cells.size) { idx ->
            val date = cells[idx]
            val inMonth = date.monthNumber == month
            val isSelected = date == selected
            val isFuture = lastAvailable != null && date > lastAvailable
            val isBeforeArchive = minDate != null && date < minDate
            val isDisabled = isFuture || isBeforeArchive
            val tagSuffix = when {
                isFuture -> ".future"
                isBeforeArchive -> ".beforeArchive"
                !inMonth -> ".otherMonth"
                else -> ""
            }
            val cellModifier = Modifier
                .testTag("DateGrid.cell.${date}$tagSuffix")
                .aspectRatio(1f)
                .padding(2.dp)
                .clip(RoundedCornerShape(radii.Default))
                .background(if (isSelected) RdpColors.Brand else RdpColors.White)
                .let { base ->
                    if (isDisabled) base
                    else base.pointerHoverIcon(PointerIcon.Hand).clickable { onSelect(date) }
                }
            Box(cellModifier, contentAlignment = Alignment.Center) {
                Text(
                    text = date.dayOfMonth.toString(),
                    textAlign = TextAlign.Center,
                    color = when {
                        isSelected -> RdpColors.White
                        isDisabled -> RdpColors.LightGrey
                        !inMonth -> RdpColors.LightGrey
                        else -> RdpColors.ContentText
                    },
                )
            }
        }
    }
}
