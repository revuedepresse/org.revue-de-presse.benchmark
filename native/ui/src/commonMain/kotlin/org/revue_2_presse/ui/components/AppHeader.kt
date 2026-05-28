package org.revue_2_presse.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.*
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.design.theme.LocalRdpSpacing
import org.revue_2_presse.design.RdpColors

@Composable
fun AppHeader(
    title: @Composable () -> Unit,
    modifier: Modifier = Modifier,
    right: (@Composable () -> Unit)? = null,
) {
    val spacing = LocalRdpSpacing.current
    Row(modifier
        .testTag("AppHeader.root")
        .fillMaxWidth()
        .background(RdpColors.White)
        .padding(horizontal = spacing.Separation2, vertical = spacing.Separation1),
        verticalAlignment = Alignment.CenterVertically,
        horizontalArrangement = Arrangement.spacedBy(spacing.Separation2),
    ) {
        Logo()
        Box(Modifier.weight(1f), contentAlignment = Alignment.CenterStart) { title() }
        right?.invoke()
    }
}
