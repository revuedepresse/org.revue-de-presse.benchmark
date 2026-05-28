package org.revue_2_presse.ui.components

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
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.design.i18n.rdpString
import org.revue_2_presse.domain.i18n.RdpStrings

@Composable
fun CalendarActionBar(
    monthLabel: String,
    onPrev: () -> Unit,
    onNext: () -> Unit,
    modifier: Modifier = Modifier,
) {
    Row(modifier.testTag("CalendarActionBar.root").fillMaxWidth(),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.SpaceBetween) {
        IconButton(onClick = onPrev, modifier = Modifier.testTag("CalendarActionBar.prev")) {
            Icon(Icons.Filled.ChevronLeft, contentDescription = rdpString(RdpStrings.Key.ActionsPrevMonth))
        }
        Text(monthLabel)
        IconButton(onClick = onNext, modifier = Modifier.testTag("CalendarActionBar.next")) {
            Icon(Icons.Filled.ChevronRight, contentDescription = rdpString(RdpStrings.Key.ActionsNextMonth))
        }
    }
}
