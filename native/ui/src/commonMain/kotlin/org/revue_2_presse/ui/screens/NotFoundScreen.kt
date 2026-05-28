package org.revue_2_presse.ui.screens

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Alignment
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.design.theme.LocalRdpSpacing
import org.revue_2_presse.ui.components.RdpButton

@Composable
fun NotFoundScreen(onBackToHome: () -> Unit, modifier: Modifier = Modifier) {
    val spacing = LocalRdpSpacing.current
    Column(
        modifier
            .testTag("NotFoundScreen.root")
            .fillMaxSize()
            .padding(spacing.Separation3),
        verticalArrangement = Arrangement.spacedBy(spacing.Separation2),
        horizontalAlignment = Alignment.CenterHorizontally,
    ) {
        Text("Contenu introuvable")
        RdpButton(onClick = onBackToHome) { Text("Retour à l'accueil") }
    }
}
