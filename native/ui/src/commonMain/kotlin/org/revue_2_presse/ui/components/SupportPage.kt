package org.revue_2_presse.ui.components

import androidx.compose.foundation.layout.*
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import org.revue_2_presse.design.theme.LocalRdpSpacing

@Composable
fun SupportPage(onDonateClick: () -> Unit, modifier: Modifier = Modifier) {
    val spacing = LocalRdpSpacing.current
    Column(modifier
        .testTag("SupportPage.root")
        .fillMaxSize()
        .padding(spacing.Separation2),
        verticalArrangement = Arrangement.spacedBy(spacing.Separation2)) {
        Text("Nous soutenir")
        Text("Aidez-nous à maintenir cette revue de presse en faisant un don.")
        RdpLink(href = "https://opencollective.com/revue-de-presse",
                onClick = { onDonateClick() },
                modifier = Modifier.testTag("SupportPage.donateLink")) {
            Text("Faire un don")
        }
    }
}
