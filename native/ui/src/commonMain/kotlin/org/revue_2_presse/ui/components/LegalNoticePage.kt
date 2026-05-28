package org.revue_2_presse.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.design.theme.LocalRdpSpacing
import org.revue_2_presse.design.RdpColors

@Composable
fun LegalNoticePage(modifier: Modifier = Modifier) {
    val spacing = LocalRdpSpacing.current
    Column(modifier
        .testTag("LegalNoticePage.root")
        .fillMaxSize()
        .verticalScroll(rememberScrollState())
        .padding(spacing.Separation2),
        verticalArrangement = Arrangement.spacedBy(spacing.Separation2)) {
        Text("Mentions légales",
             modifier = Modifier.testTag("LegalNoticePage.heading"),
             color = RdpColors.Brand)
        Text("Ce service est édité par Revue de presse. Pour toute question, contactez nous-contacter@revue-de-presse.org.")
    }
}
