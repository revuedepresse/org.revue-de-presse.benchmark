package org.revue_2_presse.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.*
import androidx.compose.material.icons.Icons
import androidx.compose.material.icons.filled.ChevronLeft
import androidx.compose.material.icons.filled.ChevronRight
import androidx.compose.material3.Icon
import androidx.compose.material3.IconButton
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.pointer.PointerIcon
import androidx.compose.ui.input.pointer.pointerHoverIcon
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.design.i18n.rdpString
import org.revue_2_presse.design.theme.LocalRdpSpacing
import org.revue_2_presse.domain.i18n.RdpStrings

@Composable
fun CalendarActionBar(
    monthLabel: String,
    yearLabel: String,
    onPrev: () -> Unit,
    onNext: () -> Unit,
    onMonthClick: () -> Unit,
    onYearClick: () -> Unit,
    modifier: Modifier = Modifier,
    prevEnabled: Boolean = true,
    nextEnabled: Boolean = true,
) {
    val spacing = LocalRdpSpacing.current
    Row(modifier.testTag("CalendarActionBar.root").fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween) {
        IconButton(
            onClick = onPrev,
            enabled = prevEnabled,
            modifier = Modifier
                .testTag("CalendarActionBar.prev")
                .pointerHoverIcon(if (prevEnabled) PointerIcon.Hand else PointerIcon.Default),
        ) {
            Icon(Icons.Filled.ChevronLeft, contentDescription = rdpString(RdpStrings.Key.ActionsPrevMonth))
        }
        Row(
            horizontalArrangement = Arrangement.spacedBy(spacing.Separation1),
            verticalAlignment = Alignment.CenterVertically,
        ) {
            Text(
                monthLabel,
                modifier = Modifier
                    .testTag("CalendarActionBar.month")
                    .pointerHoverIcon(PointerIcon.Hand)
                    .clickable { onMonthClick() },
            )
            Text(
                yearLabel,
                modifier = Modifier
                    .testTag("CalendarActionBar.year")
                    .pointerHoverIcon(PointerIcon.Hand)
                    .clickable { onYearClick() },
            )
        }
        IconButton(
            onClick = onNext,
            enabled = nextEnabled,
            modifier = Modifier
                .testTag("CalendarActionBar.next")
                .pointerHoverIcon(if (nextEnabled) PointerIcon.Hand else PointerIcon.Default),
        ) {
            Icon(Icons.Filled.ChevronRight, contentDescription = rdpString(RdpStrings.Key.ActionsNextMonth))
        }
    }
}
