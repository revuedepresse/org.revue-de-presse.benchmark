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
import org.revue_2_presse.design.RdpColors
import org.revue_2_presse.design.RdpRadii
import org.revue_2_presse.design.theme.LocalRdpSpacing

// Nuxt parity: design-system/src/components/YearPicker.lite.tsx — vertical list,
// white surface, 1px Brand border, items centred Brand text with Brand bottom
// border between them. Selected item: Brand fill, white text.
@Composable
fun YearPicker(
    selected: Int,
    range: IntRange,
    onSelect: (Int) -> Unit,
    modifier: Modifier = Modifier,
) {
    val spacing = LocalRdpSpacing.current
    val years = range.toList()
    androidx.compose.foundation.layout.Column(
        modifier
            .testTag("YearPicker.root")
            .fillMaxWidth()
            .clip(RoundedCornerShape(RdpRadii.Default))
            .border(1.dp, RdpColors.Brand, RoundedCornerShape(RdpRadii.Default))
            .background(RdpColors.White),
    ) {
        years.forEachIndexed { idx, year ->
            val isSelected = year == selected
            val rowModifier = Modifier
                .testTag("YearPicker.cell.$year")
                .fillMaxWidth()
                .background(if (isSelected) RdpColors.Brand else RdpColors.White)
                .pointerHoverIcon(PointerIcon.Hand)
                .clickable { onSelect(year) }
                .padding(PaddingValues(horizontal = spacing.Separation2, vertical = spacing.Separation1))
            Box(rowModifier, contentAlignment = Alignment.Center) {
                Text(
                    text = year.toString(),
                    color = if (isSelected) RdpColors.White else RdpColors.Brand,
                    textAlign = TextAlign.Center,
                )
            }
            if (idx < years.lastIndex) HorizontalDivider(thickness = 1.dp, color = RdpColors.Brand)
        }
    }
}
