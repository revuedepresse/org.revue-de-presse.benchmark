package org.revue_2_presse.ui.components

import androidx.compose.foundation.layout.Box
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.padding
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.ProvideTextStyle
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.design.theme.LocalRdpSpacing
import org.revue_2_presse.design.RdpColors

@Composable
fun Notice(modifier: Modifier = Modifier, content: @Composable () -> Unit) {
    val spacing = LocalRdpSpacing.current
    Box(modifier
        .testTag("Notice.root")
        .fillMaxWidth()
        .padding(spacing.Separation2),
        contentAlignment = Alignment.Center,
    ) {
        ProvideTextStyle(LocalTextStyle.current.copy(color = RdpColors.LightGrey)) {
            content()
        }
    }
}
