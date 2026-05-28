package org.revue_2_presse.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.PaddingValues
import androidx.compose.foundation.layout.aspectRatio
import androidx.compose.foundation.lazy.grid.GridCells
import androidx.compose.foundation.lazy.grid.LazyVerticalGrid
import androidx.compose.foundation.lazy.grid.items
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.unit.dp

@Composable
fun YearPicker(
    selected: Int,
    range: IntRange,
    onSelect: (Int) -> Unit,
    modifier: Modifier = Modifier,
) {
    val years = range.toList()
    LazyVerticalGrid(GridCells.Fixed(4), modifier.testTag("YearPicker.root"),
                     contentPadding = PaddingValues(8.dp)) {
        items(years.size) { i ->
            val y = years[i]
            Box(Modifier.aspectRatio(1.5f).clickable { onSelect(y) }.testTag("YearPicker.cell.$y"),
                contentAlignment = Alignment.Center) {
                Text(y.toString())
            }
        }
    }
}
