package org.revue_2_presse.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.input.pointer.PointerIcon
import androidx.compose.ui.input.pointer.pointerHoverIcon
import androidx.compose.ui.platform.testTag

// Mirrors design-system/src/components/ContactPage.lite.tsx: no contact form,
// just the email address as a mailto link. Text is hardcoded in the Mitosis
// source (not i18n), so it is mirrored verbatim here. The " :" reproduces
// the Mitosis "&nbsp;:" (French typography: no break before the colon).
@Composable
fun ContactPage(modifier: Modifier = Modifier) {
    val openExternalUrl = LocalOpenExternalUrl.current
    val email = "contact@revue-de-presse.org"
    RdpStaticPageSurface(
        title = "Nous contacter",
        modifier = modifier.testTag("ContactPage.root"),
    ) {
        Text(
            "Il est possible de prendre contact avec nous à l'adresse suivante :",
            style = RdpStaticPageStyles.body(),
        )
        Text(
            email,
            style = RdpStaticPageStyles.link(),
            modifier = Modifier
                .testTag("ContactPage.email")
                .pointerHoverIcon(PointerIcon.Hand)
                .clickable { openExternalUrl("mailto:$email") },
        )
    }
}
