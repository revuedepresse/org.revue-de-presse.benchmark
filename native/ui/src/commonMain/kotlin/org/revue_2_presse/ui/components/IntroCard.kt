package org.revue_2_presse.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Card
import androidx.compose.material3.CardDefaults
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.design.theme.LocalRdpSpacing
import org.revue_2_presse.design.RdpColors

@Composable
fun IntroCard(
    title: @Composable () -> Unit,
    body: @Composable () -> Unit,
    modifier: Modifier = Modifier,
) {
    val spacing = LocalRdpSpacing.current
    Card(modifier.testTag("IntroCard.root").fillMaxWidth(),
         colors = CardDefaults.cardColors(containerColor = RdpColors.White)) {
        Column(Modifier.padding(spacing.Separation2), verticalArrangement = Arrangement.spacedBy(spacing.Separation1)) {
            title()
            body()
        }
    }
}
