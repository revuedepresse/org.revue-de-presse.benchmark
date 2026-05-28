package org.revue_2_presse.ui.nav

import androidx.compose.runtime.Composable
import kotlinx.datetime.LocalDate
import org.revue_2_presse.domain.repositories.HighlightsRepository
import org.revue_2_presse.domain.repositories.SourcesRepository
import org.revue_2_presse.ui.screens.*

@Composable
fun NavGraph(
    nav: RdpNavController,
    highlights: HighlightsRepository,
    sources: SourcesRepository,
) {
    when (val screen = nav.current) {
        is HomeRoute -> HomeScreen(repo = highlights, onNavigate = { path ->
            nav.navigateToPath(path)
        })
        is DayRoute -> {
            val parsed = runCatching { LocalDate.parse(screen.day) }.getOrNull()
            if (parsed == null) NotFoundScreen(onBackToHome = { nav.navigate(HomeRoute) })
            else DayScreen(day = parsed, repo = highlights)
        }
        is SourcesRoute -> SourcesScreen(
            repo = sources,
            onSourceClick = { slug -> nav.navigate(SourceRoute(slug)) },
        )
        is SourceRoute -> SourceScreen(slug = screen.slug, repo = sources)
        is LegalNoticeRoute -> LegalNoticeScreen()
        is TermsOfServiceRoute -> TermsOfServiceScreen()
        is ContactRoute -> ContactScreen(onSubmit = { _, _, _ -> })
        is SupportRoute -> SupportScreen(onDonateClick = {})
        is NotFoundRoute -> NotFoundScreen(onBackToHome = { nav.navigate(HomeRoute) })
        else -> NotFoundScreen(onBackToHome = { nav.navigate(HomeRoute) })
    }
}
