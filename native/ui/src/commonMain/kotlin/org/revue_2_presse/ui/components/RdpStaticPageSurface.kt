package org.revue_2_presse.ui.components

import androidx.compose.foundation.background
import androidx.compose.foundation.layout.Arrangement
import androidx.compose.foundation.layout.Column
import androidx.compose.foundation.layout.ColumnScope
import androidx.compose.foundation.layout.Spacer
import androidx.compose.foundation.layout.fillMaxWidth
import androidx.compose.foundation.layout.height
import androidx.compose.foundation.layout.padding
import androidx.compose.foundation.rememberScrollState
import androidx.compose.foundation.shape.RoundedCornerShape
import androidx.compose.foundation.verticalScroll
import androidx.compose.material3.MaterialTheme
import androidx.compose.material3.Text
import androidx.compose.runtime.Composable
import androidx.compose.ui.Modifier
import androidx.compose.ui.draw.clip
import androidx.compose.ui.text.SpanStyle
import androidx.compose.ui.text.TextStyle
import androidx.compose.ui.text.buildAnnotatedString
import androidx.compose.ui.text.font.FontWeight
import androidx.compose.ui.text.withStyle
import org.revue_2_presse.design.RdpColors
import org.revue_2_presse.design.RdpRadii
import org.revue_2_presse.design.RdpType
import org.revue_2_presse.design.theme.LocalRdpSpacing

// Shared surface for the static informational pages (LegalNotice, TermsOfService,
// Support, Sources). Mirrors design-system/src/components/*Page.lite.tsx style:
//   background: var(--color-white)
//   border-radius: var(--radius-default)   (8dp)
//   padding: var(--separation-3)           (19dp)
//   font-family: Roboto, color: var(--color-content-text)
// h1 + h2 use Signika in Brand colour.
@Composable
fun RdpStaticPageSurface(
    title: String,
    modifier: Modifier = Modifier,
    // Default true: page is the root composable and needs to scroll. Set to
    // false when the surface is rendered inside a LazyColumn item (the parent
    // already provides scrolling; nesting two scrollables throws an
    // IllegalStateException at measure time).
    scrollable: Boolean = true,
    content: @Composable ColumnScope.() -> Unit,
) {
    val spacing = LocalRdpSpacing.current
    val surface = modifier
        .fillMaxWidth()
        .let { if (scrollable) it.verticalScroll(rememberScrollState()) else it }
        .clip(RoundedCornerShape(RdpRadii.Default))
        .background(RdpColors.White)
        .padding(spacing.Separation3)
    Column(
        surface,
        verticalArrangement = Arrangement.spacedBy(spacing.Separation1),
    ) {
        Text(text = title, style = RdpStaticPageStyles.h1())
        content()
    }
}

object RdpStaticPageStyles {
    @Composable
    fun h1(): TextStyle = MaterialTheme.typography.titleLarge

    @Composable
    fun h2(): TextStyle = TextStyle(
        fontFamily = MaterialTheme.typography.titleLarge.fontFamily,
        fontSize = RdpType.FontSizeStatusText,
        lineHeight = RdpType.LineSpacingStatusText,
        color = RdpColors.Brand,
        fontWeight = FontWeight.SemiBold,
    )

    @Composable
    fun body(): TextStyle = MaterialTheme.typography.bodyMedium

    @Composable
    fun link(): TextStyle = MaterialTheme.typography.bodyMedium.copy(
        color = RdpColors.Brand,
        textDecoration = androidx.compose.ui.text.style.TextDecoration.Underline,
    )

    @Composable
    fun footnote(): TextStyle = TextStyle(
        fontSize = RdpType.FontSizePublicationDate,
        color = RdpColors.LightGrey,
    )
}

// Inline list item with a leading bullet to mirror Nuxt's <ul><li>.
@Composable
fun RdpListItem(text: String, modifier: Modifier = Modifier) {
    val spacing = LocalRdpSpacing.current
    androidx.compose.foundation.layout.Row(
        modifier.padding(start = spacing.Separation2),
        horizontalArrangement = Arrangement.spacedBy(spacing.Separation1),
    ) {
        Text("·", style = RdpStaticPageStyles.body())
        Text(text, style = RdpStaticPageStyles.body())
    }
}

// Section header used by LegalNoticePage / TermsOfServicePage. Adds Separation2
// of vertical space above the heading so consecutive sections breathe.
@Composable
fun Section(label: String) {
    val spacing = LocalRdpSpacing.current
    Spacer(Modifier.height(spacing.Separation2))
    Text(label, style = RdpStaticPageStyles.h2())
    Spacer(Modifier.height(spacing.Separation1))
}

// "<bold scope>: rest" list item used by the TikTok permissions list.
@Composable
fun BoldScopeItem(scope: String, rest: String) {
    val spacing = LocalRdpSpacing.current
    val annotated = buildAnnotatedString {
        append("· ")
        withStyle(SpanStyle(fontWeight = FontWeight.Bold)) { append(scope) }
        append(rest)
    }
    Text(
        annotated,
        style = RdpStaticPageStyles.body(),
        modifier = Modifier.padding(start = spacing.Separation2),
    )
}
