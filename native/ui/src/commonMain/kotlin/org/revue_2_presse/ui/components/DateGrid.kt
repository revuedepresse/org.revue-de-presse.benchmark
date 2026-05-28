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
            val tagSuffix = if (inMonth) "" else ".otherMonth"
            Box(
                Modifier
                    .testTag("DateGrid.cell.${date}$tagSuffix")
                    .aspectRatio(1f)
                    .padding(2.dp)
                    .clip(RoundedCornerShape(radii.Default))
                    .background(if (isSelected) RdpColors.Brand else RdpColors.White)
                    .clickable { onSelect(date) },
                contentAlignment = Alignment.Center,
            ) {
                Text(
                    text = date.dayOfMonth.toString(),
                    textAlign = TextAlign.Center,
                    color = when {
                        isSelected -> RdpColors.White
                        !inMonth -> RdpColors.LightGrey
                        else -> RdpColors.ContentText
                    },
                )
            }
        }
    }
}
