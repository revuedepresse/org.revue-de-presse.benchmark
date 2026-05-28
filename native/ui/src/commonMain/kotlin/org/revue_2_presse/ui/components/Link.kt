package org.revue_2_presse.ui.components

import androidx.compose.foundation.clickable
import androidx.compose.foundation.layout.Row
import androidx.compose.material3.LocalTextStyle
import androidx.compose.material3.ProvideTextStyle
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.platform.testTag
import androidx.compose.ui.text.style.TextDecoration
import org.revue_2_presse.design.RdpColors

@Composable
fun RdpLink(
    href: String,
    onClick: (String) -> Unit,
    modifier: Modifier = Modifier,
    content: @Composable () -> Unit,
) {
    Row(
        modifier = modifier
            .testTag("Link.root")
            .clickable(onClick = { onClick(href) }),
    ) {
        ProvideTextStyle(LocalTextStyle.current.copy(
            color = RdpColors.BrandBluesky,
            textDecoration = TextDecoration.Underline,
        )) { content() }
    }
}
